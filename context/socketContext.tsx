"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

import io, { Socket } from "socket.io-client";

import { useSession } from "@clerk/nextjs";
import { useUser } from "@/lib/hooks/user/useUser";
import { useUserStore } from "@/store/shared/useUser.store";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const defaultSocketContext: SocketContextType = {
  socket: null,
  onlineUsers: [],
};

const SocketContext = createContext<SocketContextType>(defaultSocketContext);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { session } = useSession();

  const { user } = useUserStore();

  useEffect(() => {
    if (user && user._id) {
      const socketInstance = io(
        // /api/chat
        //   "http://localhost:9003"

        process.env.NEXT_PUBLIC_CHAT_SERVICE_ROOT_URL as string,
        {
          query: { userId: user._id },
        }
      );

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      return () => {
        socketInstance.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
