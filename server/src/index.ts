import { connectDB } from './config/db';
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import softAuth from './api/middleware/softAuth';
import authRoute from './api/routers/auth.route';
import config from './config/config';
import { connectUser, disconnectUser } from './redisStore/redisStore';
import { JWTSecurity } from './utils/security';
import projectRouter from './api/routers/project.route';
import adminRoute from './api/routers/admin.route';
import hardAuth from './api/middleware/hardAuth';
import adminAuth from './api/middleware/adminAuth';
import memberRoute from './api/routers/member.route';
import taskRoute from './api/routers/task.route';

const PORT = config.PORT || 8080;

// connect db
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use(softAuth);

app.use("/api/auth", authRoute);
app.use("/api/projects", hardAuth, projectRouter);
app.use("/api/admin", adminAuth, adminRoute);
app.use("/api/members", hardAuth, memberRoute);
app.use("/api/tasks", hardAuth, taskRoute);
// app.use("/api/comments", require("./api/routers/comment.route").default);
// app.use("/api/notifications", require("./api/routers/notification.route").default);

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
  await connectUser({ user_id: user.userId, socket_id: socket.id })
  next()
})


io.on("connection", async (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", async () => {
    console.log("Socket disconnected:", socket.id);
    await disconnectUser({ user_id: socket.user.userId, socket_id: socket.id })
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
