// import Application from '@ioc:Adonis/Core/Application'
import blogCategoryFactory from '#database/factories/blogCategoryFactory'
import campaignTypeFactory from '#database/factories/campaignTypeFactory'
import contactMessageFactory from '#database/factories/contactMessageFactory'
import knowledgebaseCategoryFactory from '#database/factories/knowledgebaseCategoryFactory'
import languageFactory from '#database/factories/languageFactory'
import roleFactory from '#database/factories/roleFactory'
import serviceCategoryFactory from '#database/factories/serviceCategoryFactory'
import serviceTagFactory from '#database/factories/serviceTagFactory'
import supportTicketFactory from '#database/factories/supportTicketFactory'
import templateFactory from '#database/factories/templateFactory'
import userFactory from '#database/factories/userFactory'
import { TicketStatus, permissions, userTypes } from '#helpers/enums'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    // if (
    //   (!Seeder.default.environment.includes('development') && Application.inDev) ||
    //   (!Seeder.default.environment.includes('testing') && Application.inTest) ||
    //   (!Seeder.default.environment.includes('serviceion') && Application.inProduction)
    // ) {
    //   return
    // }
    await new Seeder.default(this.client).run()
  }
  async run() {
    const permissionsObject: any[] = []

    for (const perm of Object.values(permissions)) {
      permissionsObject.push(perm)
    }

    await roleFactory
      .merge([
        { name: 'Super Admin', isActive: true, permissions: permissionsObject },
        { name: 'Moderator' },
        { name: 'Vendor' },
      ])
      .createMany(3)

    await userFactory
      .merge([{ email: 'admin@gmail.com', isActive: true, roleId: 1, userType: userTypes.ADMIN }])
      .createMany(14)

    await userFactory
      .merge([{ email: 'vendor@gmail.com', isActive: true, userType: userTypes.VENDER }])
      .with('businessProfile', 1, (b) => {
        b.with('services', 7, (p) => {
          p.with('variants', 2)
          p.with('faq')
        })
      })
      .createMany(8)

    await userFactory
      .merge([
        {
          email: 'user@gmail.com',
          password: '123456789',
          isActive: true,
          userType: userTypes.USER,
        },
      ])
      .createMany(10)

    await blogCategoryFactory.with('blogs', 5).createMany(4)
    await knowledgebaseCategoryFactory.with('contents', 5).createMany(3)
    await contactMessageFactory.createMany(15)
    await supportTicketFactory
      .merge([
        { status: TicketStatus.CLOSED },
        { status: TicketStatus.CLOSED },
        { status: TicketStatus.CLOSED },
        { status: TicketStatus.RESPONDED },
        { status: TicketStatus.RESPONDED },
        { status: TicketStatus.RESPONDED },
      ])
      .createMany(9)

    // service
    await serviceCategoryFactory
      .with('subCategory', 3, (sub) => {
        sub.with('faqs', 3).with('seo')
      })
      .with('faqs', 3)
      .with('seo')
      .createMany(3)

    // campaign
    await campaignTypeFactory
      .with('campaign', 3, (c) => {
        c.with('interests', 3, (i) => {
          i.with('subscribers', 3)
        })
      })
      .createMany(3)

    await templateFactory
      .merge({
        name: 'Forgot Password Email',
        content:
          'Forgot Your Password! Dont Worry. Here is your 6 digts code {{otp}}, Use it to reset the password',
      })
      .create()

    await languageFactory.createMany(10)
    await serviceTagFactory.createMany(10)
  }
}
