import { connectDB } from './config/db';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import softAuth from './api/middleware/softAuth';
import authRoute from './api/routers/auth.route';
import config from './config/config';

const PORT = config.PORT || 8080;

// connect db
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use(softAuth);

app.use("/api/auth", authRoute);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

const serverInstance = server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
