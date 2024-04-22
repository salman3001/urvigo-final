import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Role from '../models/role.js'
import { paginate } from '../helpers/common.js'
import vine from '@vinejs/vine'
import { permissions } from '../helpers/enums.js'
import { IndexOption } from '../helpers/types.js'

@inject()
export default class RoleService {
  constructor(protected ctx: HttpContext) {}

  async index(opt?: IndexOption) {
    const { request, bouncer } = this.ctx
    await bouncer.with('RolePolicy').authorize('viewList')
    const roleQuery = Role.query()

    !opt?.disableFilter && roleQuery.filter(request.qs())
    const roles = await paginate(roleQuery, request)

    return roles
  }

  async show() {
    const { bouncer, params } = this.ctx
    await bouncer.with('RolePolicy').authorize('view')

    const id = params.id
    const role = await Role.query().where('id', id).firstOrFail()

    return role
  }

  async store() {
    const { request, bouncer } = this.ctx
    await bouncer.with('RolePolicy').authorize('create')

    const payloadSchema = vine.compile(
      vine.object({
        name: vine.string().unique(async (db, value) => {
          const role = await db.from('roles').where('name', value).first()
          return !role
        }),
        isActive: vine.boolean().optional(),
      })
    )

    const payload = await request.validateUsing(payloadSchema)

    const record = await Role.create(payload)

    return record
  }

  async update() {
    const { request, params, bouncer } = this.ctx
    await bouncer.with('RolePolicy').authorize('update')
    const role = await Role.findOrFail(+params.id)

    const permissions = request.input('permissions') || []

    const isActive = request.input('isActive')

    role.isActive = isActive
    role.permissions = permissions
    await role.save()

    return role
  }

  async allPermissions() {
    const { bouncer } = this.ctx
    await bouncer.with('RolePolicy').authorize('viewList')

    const permissionsArray: string[] = []

    for (const perm of Object.values(permissions)) {
      permissionsArray.push(perm)
    }

    return permissionsArray
  }

  async destroy() {
    const { params, bouncer } = this.ctx
    const role = await Role.findOrFail(+params.id)

    await bouncer.with('RolePolicy').authorize('delete')

    await role.delete()

    return role
  }
}
