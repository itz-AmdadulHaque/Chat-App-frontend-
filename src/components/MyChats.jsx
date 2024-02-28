import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useChat from "../hooks/useChat";
import { FaPlus } from "react-icons/fa";
import chatName from "../utils/chatName";
import GroupModel from "./GroupModel";

const MyChats = () => {
  const { user, chats, setChats } = useChat();
  const axiosPrivate = useAxiosPrivate();

  const [groupClick, setGroupClick] = useState(false)

  return (
    <div className="w-[300px] h-full px-4 flex flex-col bg-neutral-800 ">
      <section className="flex justify-between items-center my-2 ">
        <h2 className="text-xl font-semibold">My Chats</h2>
        <button className="flex items-center gap-2 px-[4px] py-[2px] rounded-md bg-neutral-900 border-2 border-neutral-900 hover:border-neutral-700" onClick={()=> setGroupClick(true)}>
          <p>New Group Chat</p><FaPlus />
        </button>
        {groupClick && <GroupModel setGroupClick= {setGroupClick}/>}
      </section>

      <section className="min-h-0 flex-grow">
        <ul className="h-full  custom-scrollbar overflow-x-hidden overflow-y-auto">
          {chats.map((chat) => (
            <li
              className="p-2 my-2 bg-neutral-600 hover:bg-neutral-500"
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
