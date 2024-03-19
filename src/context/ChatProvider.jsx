import { createContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState({});
  const [waiting, setWaiting] = useState(false);
  const [notification, setNotification] = useState([]);
  const [socket, setSocket] = useState({});
  const [socketConnected, setSocketConnected] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        waiting,
        setWaiting,
        socket,
        setSocket,
        socketConnected,
        setSocketConnected,
        isMobile,
        setIsMobile,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
