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
    isMobile,
  } = useChat();
  const axiosPrivate = useAxiosPrivate();

  const [socketConnected, setSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setWaiting(true);

        const resChats = await axiosPrivate.get("/chat");
        console.log(resChats?.data?.data);
        setChats(resChats?.data?.data);

        //get user if page refresh
        if (Object.keys(user).length === 0) {
          const resUser = await axiosPrivate.get("/users/");
          console.log("User Profile: \n", resUser?.data?.data);
          setUser(resUser?.data?.data);

          // if page refresh we have to get the localy store value using user id

          // in mobile we wont set the selected chat untill click on certain chat
          const storeIndex = localStorage.getItem(`${resUser?.data?.data?._id}`);

          if (!isMobile || storeIndex) {
            // getting selected chat index from chats list from storage or set to first one
            const selectedChatIndex = storeIndex || 0;

            const chatIndex = parseInt(selectedChatIndex);
            console.log(parseInt(selectedChatIndex));

            setSelectedChat(resChats?.data?.data[chatIndex]);
          }
        } else {
          // in mobile we wont set the selected chat untill click on certain chat
          const storeIndex = localStorage.getItem(`${user?._id}`);

          if (!isMobile || storeIndex) {
            // getting selected chat index from chats list from storage or set to first one
            const selectedChatIndex = storeIndex || 0;

            const chatIndex = parseInt(selectedChatIndex);
            console.log(parseInt(selectedChatIndex));

            setSelectedChat(resChats?.data?.data[chatIndex]);
          }
        }

        setWaiting(false);
      } catch (error) {
        console.log(error?.message);
        setWaiting(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (user?._id) {
      //set socket connection
      const backendUrl = import.meta.env.VITE_BASE_URL.slice(0, -6); // removing /api/v1
      const newSocket = io(backendUrl);
      setSocket(newSocket);
      console.log("//user addded//");
      newSocket.emit("setup", user);
      newSocket.on("connected", () => {
        setSocketConnected(true);
      });
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-[2px] h-screen">
      {/* must check chat is selected or the 'join room' will be undefined */}
      {!Waiting && socket && !socketConnected && !selectedChat?._id ? (
        "loading ..."
      ) : (
        <>
          <Navbar />
          <div className="min-h-0 flex-grow">
            <div className=" h-full flex gap-[2px]">
              <MyChats />
              <Chatbox socket={socket} socketConnected={socketConnected} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
