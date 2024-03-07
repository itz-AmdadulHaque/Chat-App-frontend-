import { IoSendSharp } from "react-icons/io5";
import useChat from "../hooks/useChat";
import chatName from "../utils/chatName";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useState } from "react";
import GroupUpdate from "./GroupUpdate";
import ProfileModel from "./ProfileModel"
const Chatbox = () => {
  const { user, selectedChat } = useChat();
  const [viewDetail, setViewDetail] = useState(false);
  return (
    <div className="min-h-0 flex-grow bg-neutral-800">
      <div className="h-full flex flex-col">
        {/* chat name and detail */}
        <section className="p-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {selectedChat?.isGroupChat
              ? selectedChat?.chatName
              : Object.keys(selectedChat).length !== 0
              ? chatName(user?._id, selectedChat?.users)
              : "Loading..."}
          </h3>

          {/* view detail */}
          <div>
            <button
              className="px-2 py-[4px] bg-neutral-600 rounded-md text-neutral-800 hover:text-neutral-300"
              onClick={() => setViewDetail((pre) => !pre)}
            >
              <MdOutlineRemoveRedEye />
            </button>
          </div>
          {viewDetail && selectedChat?.isGroupChat && <GroupUpdate setViewDetail={setViewDetail}/>}
          {viewDetail && !selectedChat?.isGroupChat && <ProfileModel setViewDetail={setViewDetail} viewUser= {(selectedChat?.users).filter(eachUser => eachUser?._id !== user?._id)[0]}/>}
        </section>

        {/* message box */}
        <section className="min-h-0 flex-grow bg-neutral-600">messages</section>
        {/* message send */}
        <section className="p-2">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              className="flex-grow rounded px-2 py-[2px] bg-neutral-700"
              type="text"
              placeholder="type your message"
            />
            <button
              className="border-2 px-2 rounded border-neutral-700 hover:text-neutral-700"
              type="submit"
            >
              <IoSendSharp />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Chatbox;
