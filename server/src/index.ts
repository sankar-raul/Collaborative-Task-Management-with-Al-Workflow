import { connectDB } from './config/db';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';
import softAuth from './api/middleware/softAuth';
import authRoute from './api/routers/auth.route';
import config from './config/config';
import { connectUser, disconnectUser } from './redisStore/redisStore';
import { JWTSecurity } from './utils/security';

const PORT = config.PORT || 8080;

// connect db
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use(softAuth);

app.use("/api/auth", authRoute);

const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" }
});


io.use(async (socket, next) => {
    // const token = cookie.parse(socket.request.headers.cookie || '')?.access_token
    const token = socket.handshake.auth.token
    // console.log(token)
    if (!token) {
        return next(new Error("unauthorized!"))
    }
    const user = JWTSecurity.verifyToken(token)
    // console.log(token)
    if (!user) return next(new Error("unauthorized!"))
    socket.user = user
    await connectUser({user_id: user.userId, socket_id: socket.id})
    next()
})


io.on("connection", async (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", async () => {
    console.log("Socket disconnected:", socket.id);
    await disconnectUser({user_id: socket.user.userId, socket_id: socket.id})
  });
});

const serverInstance = server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
