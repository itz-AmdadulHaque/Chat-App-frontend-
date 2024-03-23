import { useEffect, useState } from "react";
import useChat from "../hooks/useChat";
import { FaPlus } from "react-icons/fa";
import chatName from "../utils/chatName";
import GroupModel from "./GroupModel";
import currentMessage from "../utils/currentMessage";
import formatTimestamp from "../utils/formatTimestamp";
import messageHilight from "../utils/messageHilight";

const MyChats = ({ socket }) => {
  const {
    user,
    waiting,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    isMobile,
  } = useChat();

  const [groupClick, setGroupClick] = useState(false); // create group

  const handleChatSelected = (chat, index) => {
    socket.emit("leave chat", selectedChat?._id);

    // clear the message from notification, which disable highlighting message
    setNotification(preNotification =>{
      return preNotification.filter((message)=> message?.chat?._id !== chat?._id)
    })

    // set selected chat
    setSelectedChat(chat);
    // store chat index with naming as user id
    localStorage.setItem(`${user?._id}`, index.toString());
  };

  return (
    <div
      className={`w-full sm:w-min h-full px-4 flex flex-col bg-neutral-800 ${
        isMobile && Object.keys(selectedChat).length !== 0 && "hidden"
      }`}
    >
      <section className="flex items-center justify-between  my-2 sm:gap-4">
        <h2 className="text-xl font-semibold w-max">My Chats</h2>
        <button
          className="flex items-center gap-2 px-[4px] py-[2px] rounded-md bg-neutral-900 border-2 border-neutral-900 hover:border-neutral-700"
          onClick={() => setGroupClick(true)}
        >
          <p className=" w-max">
            <span className="hidden md:inline">Create</span> Group
          </p>
          <FaPlus />
        </button>
        {groupClick && <GroupModel setGroupClick={setGroupClick} />}
      </section>

      {chats.length === 0 && (
        <p className="h-full flex flex-col justify-center items-center">
          Start a chat
        </p>
      )}

      <section className="min-h-0 flex-grow">
        <ul className="h-full custom-scrollbar overflow-x-hidden overflow-y-auto">
          {chats.map((chat, index) => (
            <li
              onClick={() => {
                handleChatSelected(chat, index);
              }}
              className={`p-[2px] my-[2px] hover:bg-neutral-500 ${
                selectedChat?._id === chat?._id
                  ? "bg-neutral-500"
                  : "bg-neutral-600"
              }`}
              key={chat?._id}
            >
              <div className="w-full">
                {/* chat name */}
                <p className="text-neutral-300 text-lg">
                  {chat?.isGroupChat
                    ? chat?.chatName
                    : chatName(user?._id, chat?.users)}
                </p>
                {/* message and time */}
                <div
                  className={`text-sm flex ${
                    messageHilight(notification, chat?._id) ? "text-green-300" : "text-neutral-400"
                  }`}
                >
                  <p className="flex-grow">{currentMessage(chat, user?._id)}</p>
                  <p>
                    {formatTimestamp(
                      chat?.latestMessage?.updatedAt || chat?.updatedAt
                    )}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MyChats;
