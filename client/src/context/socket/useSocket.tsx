import { createContext, useContext } from "react"
import type { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}
;

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};
