import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToSocket } from './controllers/socketManeger.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const server = createServer(app);

connectToSocket(server);

const url = process.env.MONGO_URL;
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  // 'http://localhost:5173',
  'https://meetmaster-zoom-frontend.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '40kb' }));
app.use(express.urlencoded({ limit: '40kb', extended: true }));
app.use('/api/v1/users', userRoutes);

app.get('/home', (req, res) => {
  return res.json({ hello: 'world' });
});

const start = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log('Connected to MongoDB Atlas');

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

start();
