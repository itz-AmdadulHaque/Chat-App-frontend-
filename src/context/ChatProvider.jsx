import { createContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [waiting, setWaiting] = useState(false)

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        chats,
        setChats,
        notification,
        setNotification,
        waiting,
        setWaiting
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
