import { io, Socket } from "socket.io-client";
import { BACKEND_END_POINT } from "@/config/config";

// Get base URL (remove /api/ suffix for socket connection)
const socketUrl = BACKEND_END_POINT.replace("/api/", "");

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(socketUrl, {
      autoConnect: false,
      withCredentials: true,
    });
  }
  return socket;
};

export const connectSocket = (token?: string) => {
  const socketInstance = getSocket();
  
  if (token) {
    socketInstance.auth = { token };
  }
  
  if (!socketInstance.connected) {
    socketInstance.connect();
  }
  
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const joinProjectRoom = (projectId: string) => {
  const socketInstance = getSocket();
  if (socketInstance.connected) {
    socketInstance.emit("joinProject", projectId);
  }
};

export const leaveProjectRoom = (projectId: string) => {
  const socketInstance = getSocket();
  if (socketInstance.connected) {
    socketInstance.emit("leaveProject", projectId);
  }
};

export default getSocket;
