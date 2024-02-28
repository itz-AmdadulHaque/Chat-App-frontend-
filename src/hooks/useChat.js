import { useContext } from "react";
import ChatContext from "../context/ChatProvider.jsx";

const useChat = () => {
  return useContext(ChatContext);
};

export default useChat;
