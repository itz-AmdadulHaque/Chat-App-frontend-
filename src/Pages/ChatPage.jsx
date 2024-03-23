import React, { useEffect, useState } from "react";
import useChat from "../hooks/useChat";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navbar from "../components/Navbar";
import MyChats from "../components/MyChats";
import Chatbox from "../components/Chatbox";
import { io } from "socket.io-client";
import SpinnerCenter from "../components/Loadings/SpinnerCenter";

const ChatPage = () => {
  const {
    user,
    setUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    allMessages,
    setAllMessages,
    notification,
    setNotification,
    Waiting,
    setWaiting,
    isMobile,
  } = useChat();
  const axiosPrivate = useAxiosPrivate();

  const [socketConnected, setSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setWaiting(true);

        // get all chats
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
          const storeIndex = localStorage.getItem(
            `${resUser?.data?.data?._id}`
          );

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

        setErrorMessage("");
        setWaiting(false);
      } catch (error) {
        console.log(error);
        // Access specific error message if available
        const errorMessage =
          error.response?.data?.message || "An error occurred.";

        setErrorMessage(errorMessage);
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

  //  recieve message events
  useEffect(() => {
    const handleMessageReceived = (newMessageRecieved) => {
      console.log("recieved message", newMessageRecieved);
      //set this chat to top of chat list
      setChats((preChats) => {
        const filterChats = preChats.filter(
          (chat) => chat?._id !== newMessageRecieved?.chat?._id
        );
        newMessageRecieved.chat.latestMessage = newMessageRecieved
        //  letest message not here
        return [newMessageRecieved?.chat, ...filterChats];
      });
      // console.log("selected chat: ", Object.keys(selectedChat).length)

      if (
        Object.keys(selectedChat).length === 0 ||
        selectedChat?._id !== newMessageRecieved?.chat?._id
      ) {
        // give notification
        setNotification((preNotification) => [
          ...preNotification,
          newMessageRecieved,
        ]);
        // store chat index according to selected chat
        console.log("Not selected chat or other slected");
      } else {
        console.log("in same chat");
        setAllMessages((preMessage) => [...preMessage, newMessageRecieved]);

        //when message recive this chat is on top, on refresh the top chat will show
        // both in message recieve and send, this should be added
        localStorage.setItem(`${user?._id}`, "0");
      }
    };

    if (socketConnected && socket) {
      // message recieve even
      socket.on("message_recieved", handleMessageReceived);
    }

    return () => {
      if (socketConnected && socket) {
        // console.log("cleaning message event");
        socket.off("message_recieved", handleMessageReceived);
      }
    };
  });

  return (
    <div className="flex flex-col gap-[2px] h-screen">
      {/* must check chat is selected or the 'join room' will be undefined */}
      {!Waiting && socket && !socketConnected && !selectedChat?._id ? (
        <>
          <Navbar />
          <div className="flex-grow">
            <SpinnerCenter />
          </div>
        </>
      ) : (
        <>
          <Navbar />
          {errorMessage ? (
            <div className="flex-grow flex justify-center items-center">
              <p className="text-red-500 text-xl">
                Error:{" "}
                {errorMessage === "No Refresh Token"
                  ? "Please Login"
                  : errorMessage}
              </p>
            </div>
          ) : (
            <div className="min-h-0 flex-grow">
              <div className=" h-full flex gap-[2px]">
                <MyChats socket={socket} />
                <Chatbox socket={socket} socketConnected={socketConnected} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatPage;
