import app from '@adonisjs/core/services/app'
import Ws from '#services/ws'
import wsAuth from '#middleware/ws_auth'
import NotificationSocketController from '#controllers/ws/notification_socket_controller'
import ChatSocketController from '#controllers/ws/chat_socket_controller'

app.ready(() => {
  Ws.boot()
  if (Ws.io) {
    // const homeSocket = Ws.io.of('/').use(wsAuth)
    // const ticketChatIo = Ws.io.of('/ticket_chat/').use(wsAuth)
    const userSocketIo = Ws.io.of('/notifications/').use(wsAuth)
    const ChatIo = Ws.io.of('/chat/').use(wsAuth)

    // ticketChatIo.on('connection', (socket) => {
    //   const controller = new TicketChatSocketController(socket, ticketChatIo)
    //   controller.execute()
    // })

    userSocketIo.on('connection', (socket) => {
      const controller = new NotificationSocketController(socket, userSocketIo)
      controller.execute()
    })

    ChatIo.on('connection', (socket) => {
      const controller = new ChatSocketController(socket, ChatIo)
      controller.execute()
    })
  } else {
    console.error('Socket instance not found')
  }
})
