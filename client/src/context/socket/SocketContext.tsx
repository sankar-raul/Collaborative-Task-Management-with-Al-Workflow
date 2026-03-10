import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "../../utils/socket";
import { useAuth } from "../auth";
import { SocketContext } from "./useSocket";


interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { member } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (member) {
      // Get token from localStorage
      const token = localStorage.getItem("access_token");
      
      // Connect socket when user is authenticated
      const socketInstance = connectSocket(token || undefined);
      socketRef.current = socketInstance;

      const handleConnect = () => {
        console.log("Socket connected:", socketInstance.id);
        setIsConnected(true);
        setSocket(socketInstance);
      };

      const handleDisconnect = () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      };

      const handleConnectError = (error: Error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      };

      socketInstance.on("connect", handleConnect);
      socketInstance.on("disconnect", handleDisconnect);
      socketInstance.on("connect_error", handleConnectError);

      return () => {
        socketInstance.off("connect", handleConnect);
        socketInstance.off("disconnect", handleDisconnect);
        socketInstance.off("connect_error", handleConnectError);
        disconnectSocket();
        socketRef.current = null;
      };
    }
    
    // Cleanup when member is removed
    return () => {
      if (socketRef.current) {
        disconnectSocket();
        socketRef.current = null;
      }
    };
  }, [member]);

  // Sync state when member changes
  useEffect(() => {
    if (!member) {
      setSocket(null);
      setIsConnected(false);
    }
  }, [member]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
