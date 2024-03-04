import React, { useEffect, useState } from "react";
import useChat from "../hooks/useChat";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navbar from "../components/Navbar";
import MyChats from "../components/MyChats";
import Chatbox from "../components/Chatbox";

const ChatPage = () => {
  const { user, setUser, chats, setChats, selectedChat,setSelectedChat, Waiting, setWaiting } = useChat();
  const axiosPrivate = useAxiosPrivate();


  useEffect(() => {
    async function fetchData() {
      try {
        setWaiting(true);
        if (Object.keys(user).length === 0) {
          const resUser = await axiosPrivate.get("/users/");
          console.log("User Profile: \n", resUser?.data?.data);
          setUser(resUser?.data?.data);
        }

        const resChats = await axiosPrivate.get("/chat");
        console.log(resChats?.data?.data);
        setChats(resChats?.data?.data);
        
        // getting selected chat index from chats list from storage or set to first one
        const selectedChatIndex = localStorage.getItem('selectedChatIndex') || 0
        const chatIndex  = parseInt(selectedChatIndex)
        console.log(parseInt(selectedChatIndex))
        setSelectedChat(resChats?.data?.data[chatIndex])


        setWaiting(false);
      } catch (error) {
        console.log(error?.message);
        setWaiting(false);
      }
    }

    fetchData();
  }, []);
  return (
    <div className="flex flex-col h-screen">
      {Waiting ? (
        "loading ..."
      ) : (
        <>
          <Navbar />
          <div className="py-[2px] min-h-0 flex-grow gap-2">
            <div className=" h-full flex gap-1">
              <MyChats />
              <Chatbox/>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
