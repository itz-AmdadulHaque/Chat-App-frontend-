import React, { useEffect, useState } from "react";
import useChat from "../hooks/useChat";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Search from "../components/Search";
import Navbar from "../components/Navbar";
import MyChats from "../components/MyChats";

const ChatPage = () => {
  const { user, setUser, chats, setChats, Waiting, setWaiting } = useChat();
  const axiosPrivate = useAxiosPrivate();

  const [openChat, setOpenChat] = useState()

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
            <div className=" h-full flex">
              <MyChats />
              <p>My messagaes</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
