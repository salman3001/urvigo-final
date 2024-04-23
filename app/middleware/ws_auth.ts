import User from '#models/user'
import { Socket } from 'socket.io'

const wsAuth = async (socket: Socket, next: (err?: any) => void) => {
  const token = socket.handshake.auth['socket-token']
  const userId = socket.handshake.auth['user-id']

  if (!token || !userId) {
    next(new Error('Unauthorized'))
    return
  }

  const user = await User.findBy('id', userId)

  if (user?.socketToken === token) {
    socket.handshake.auth.user = user
    next()
    return
  }

  next(new Error('Unauthorized'))
}

export default wsAuth
