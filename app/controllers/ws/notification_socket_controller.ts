import { isAdmin } from '#helpers/permission_helpers'
import { Namespace, Socket } from 'socket.io'
export default class NotificationSocketController {
  constructor(
    private socket: Socket,
    private io: Namespace
  ) {}
  private room: string | null = null
  execute() {
    this.room = this.createRoom(this.socket.handshake.auth.user)
    this.socket.join(this.room)
    this.io.to(this.room).emit('room-joined', this.room)
  }

  private createRoom(user: any): string {
    if (isAdmin(user)) {
      return `notification-room-${user.id}`
    } else {
      return `notification-room-${user.id}`
    }
  }
}
