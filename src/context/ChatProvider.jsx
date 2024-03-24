import { createContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [notification, setNotification] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [allMessages, setAllMessages] = useState([]);

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
        allMessages,
        setAllMessages,
        notification,
        setNotification,
        waiting,
        setWaiting,
        isMobile,
        setIsMobile,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
