import React, { useEffect, useState } from "react";
import useChat from "../hooks/useChat";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navbar from "../components/Navbar";
import MyChats from "../components/MyChats";
import Chatbox from "../components/Chatbox";
import { io } from "socket.io-client";

const ChatPage = () => {
  const {
    user,
    setUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    Waiting,
    setWaiting,
    socket,
    setSocket,
    setSocketConnected,
    isMobile,
  } = useChat();
  const axiosPrivate = useAxiosPrivate();

  const [viewChats, setViewChat] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setWaiting(true);
        if (Object.keys(user).length === 0) {
          //get user data if refresh
          const resUser = await axiosPrivate.get("/users/");
          console.log("User Profile: \n", resUser?.data?.data);
          setUser(resUser?.data?.data);
        }

        const resChats = await axiosPrivate.get("/chat");
        console.log(resChats?.data?.data);
        setChats(resChats?.data?.data);

        // in mobile we wont set the selected chat untill click on certain chat
        const storeIndex = localStorage.getItem("selectedChatIndex");

        if (!isMobile || storeIndex) {
          // getting selected chat index from chats list from storage or set to first one
          const selectedChatIndex = storeIndex || 0;

          const chatIndex = parseInt(selectedChatIndex);
          console.log(parseInt(selectedChatIndex));

          setSelectedChat(resChats?.data?.data[chatIndex]);
        }

        //set socket connection
        const backendUrl = import.meta.env.VITE_BASE_URL.slice(0, -6); // removing /api/v1
        const newSocket = io(backendUrl);

        newSocket.emit("setup", user);
        newSocket.on("connection", () => setSocketConnected(true));

        setSocket(newSocket);

        setWaiting(false);
      } catch (error) {
        console.log(error?.message);
        setWaiting(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-[2px] h-screen">
      {Waiting && socket ? (
        "loading ..."
      ) : (
        <>
          <Navbar />
          <div className="min-h-0 flex-grow">
            <div className=" h-full flex gap-[2px]">
              <MyChats viewChats={viewChats}/>
              <Chatbox viewChats={viewChats}/>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
