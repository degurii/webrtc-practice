import { Server } from 'socket.io';

const io = new Server(3000, {
  cors: {
    origin: 'http://localhost:1234',
    credentials: true,
  },
});

io.on('connection', socket => {
  socket.on('join', () => {
    console.log(`[${socket.id}] joined!!`);
    socket.broadcast.emit('join', { sourceSocketId: socket.id });
  });
  socket.on('disconnect', () => {
    console.log(`[${socket.id}] disconnected!!`);
  });
  socket.on('offer', ({ destinationSocketId, offer }) => {
    socket.broadcast
      .to(destinationSocketId)
      .emit('offer', { sourceSocketId: socket.id, offer });
  });
  socket.on('answer', ({ destinationSocketId, answer }) => {
    socket.broadcast
      .to(destinationSocketId)
      .emit('answer', { sourceSocketId: socket.id, answer });
  });
  socket.on('candidate', ({ destinationSocketId, candidate }) => {
    socket.broadcast
      .to(destinationSocketId)
      .emit('candidate', { sourceSocketId: socket.id, candidate });
  });
});
