import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const server = createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://meetmaster-zoom-frontend.onrender.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '40kb' }));
app.use('/api/v1/users', userRoutes);

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'] },
});

io.on('connection', (socket) => {
  socket.on('join-call', (path) => {
    socket.join(path);
    const clients = Array.from(io.sockets.adapter.rooms.get(path) || []);
    socket.emit('user-joined', socket.id, clients);
    socket.to(path).emit('user-joined', socket.id, clients);
  });

  socket.on('signal', (toId, message) => {
    io.to(toId).emit('signal', socket.id, message);
  });

  socket.on('chat-message', (data, sender) => {
    io.emit('chat-message', data, sender, socket.id);
  });

  socket.on('disconnect', () => {
    io.emit('user-left', socket.id);
  });
});

const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_URL).then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
