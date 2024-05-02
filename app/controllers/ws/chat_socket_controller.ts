import User from '#models/user'
import { Namespace, Socket } from 'socket.io'

export default class ChatSocketController {
  constructor(
    private socket: Socket,
    private io: Namespace
  ) {}

  private room: string | null = null

  async execute() {
    this.room = await this.createChatRoom(this.socket.handshake.auth?.user)

    if (await this.isAllowed(this.socket.handshake.auth?.user)) {
      this.room && this.socket.join(this.room)
      this.room && this.io.to(this.room).emit('room-joined', this.room)
    }
  }

  private async createChatRoom(user: User): Promise<string | null> {
    return `chat-room-${user.id}`
  }

  private async isAllowed(_user: any): Promise<boolean> {
    // if (this.conversation && this.ticket.userId === user.id) {
    //   return true
    // }

    // if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TICKETS))) {
    //   return true
    // }

    return true
  }
}
