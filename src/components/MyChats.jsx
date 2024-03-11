import { useEffect, useState } from "react";
import useChat from "../hooks/useChat";
import { FaPlus } from "react-icons/fa";
import chatName from "../utils/chatName";
import GroupModel from "./GroupModel";

const MyChats = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat, isMobile } = useChat();

  const [groupClick, setGroupClick] = useState(false) // create group

  const handleChatSelected = (chat, index)=>{
    setSelectedChat(chat)
    localStorage.setItem('selectedChatIndex', index.toString());
  }

  return (
    <div className={`w-full sm:w-max h-full px-4 sm:flex sm:flex-col bg-neutral-800 ${isMobile && Object.keys(selectedChat).length !== 0 && "hidden"}`}>
      <section className="flex items-center justify-between  my-2 sm:gap-4">
        <h2 className="text-xl font-semibold w-max">My Chats</h2>
        <button className="flex items-center gap-2 px-[4px] py-[2px] rounded-md bg-neutral-900 border-2 border-neutral-900 hover:border-neutral-700" onClick={()=> setGroupClick(true)}>
          <p className="hidden sm:block w-max">New Group Chat</p><FaPlus />
        </button>
        {groupClick && <GroupModel setGroupClick= {setGroupClick}/>}
      </section>

      {chats.length === 0 && <p className="h-full flex flex-col justify-center items-center">No chats</p>}

      <section className="min-h-0 flex-grow">
        <ul className="h-full  custom-scrollbar overflow-x-hidden overflow-y-auto">
          {chats.map((chat, index) => (
            <li
              onClick={()=> {handleChatSelected(chat, index)}}
              className={`p-2 my-2 hover:bg-neutral-500 ${selectedChat?._id === chat?._id ? "bg-neutral-500" : "bg-neutral-600"}`}
              key={chat?._id}
            >
              {chat?.isGroupChat? chat?.chatName: chatName(user?._id, chat?.users)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MyChats;
