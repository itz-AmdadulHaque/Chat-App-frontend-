import { IoSendSharp } from "react-icons/io5";
import useChat from "../hooks/useChat";
import chatName from "../utils/chatName";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";
import GroupUpdate from "./GroupUpdate";
import ProfileModel from "./ProfileModel";
import Messages from "./Messages";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Chatbox = () => {
  const {
    user,
    chats,
    selectedChat,
    setSelectedChat,
    socket,
    socketConnected,
    isMobile
  } = useChat();
  const axiosPrivate = useAxiosPrivate();

  const [viewDetail, setViewDetail] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [sendError, setSendError] = useState("");

  // get all the messages
  const fetchMessages = async () => {
    try {
      const { data } = await axiosPrivate.get(`/messages/${selectedChat?._id}`);
      console.log("Messages", data);

      setAllMessages(data?.data);

      socket.emit("join chat", selectedChat?._id);
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
    }
  };

  useEffect(() => {
    if (Object.keys(selectedChat).length !== 0) {
      fetchMessages();
    }
  }, [selectedChat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    setSendError("");

    try {
      setButtonDisabled(true);

      const { data } = await axiosPrivate.post("/messages/", {
        chatId: selectedChat?._id,
        content: messageValue,
      });
      console.log(data);

      setAllMessages((preMessage) => [...preMessage, data?.data]);
      setMessageValue("");
      setButtonDisabled(false);
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message || "An error occurred.";

      setButtonDisabled(false);
      setSendError("Sending failed, check internet connection");
    }
  };

  return (
    <div className={`min-h-0 px-2 w-full sm:flex-grow bg-neutral-800 ${isMobile && Object.keys(selectedChat).length === 0 && "hidden"}`}>
      {Object.keys(selectedChat).length === 0 ? (
        <div className="h-full flex flex-col justify-center items-center">
          <p>Search and Select a User to Chat</p>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* chat name and detail icon option */}
          <section className="p-2 flex justify-between items-center">
            <div className="flex items-center gap-1">
              <button className="px-[4px]  hover:text-red-300 sm:hidden" onClick={()=>{
                setSelectedChat({})
              }}>
                <BiArrowBack />
              </button>
              <h3 className="text-lg font-semibold">
                {selectedChat?.isGroupChat
                  ? selectedChat?.chatName
                  : chatName(user?._id, selectedChat?.users)}
              </h3>
            </div>

            {/* view detail */}
            <div>
              <button
                className="px-2 py-[4px] bg-neutral-600 rounded-md text-neutral-800 hover:text-neutral-300"
                onClick={() => setViewDetail((pre) => !pre)}
              >
                <MdOutlineRemoveRedEye />
              </button>
            </div>
            {viewDetail && selectedChat?.isGroupChat && (
              <GroupUpdate setViewDetail={setViewDetail} />
            )}
            {viewDetail && !selectedChat?.isGroupChat && (
              <ProfileModel
                setViewDetail={setViewDetail}
                viewUser={
                  (selectedChat?.users).filter(
                    (eachUser) => eachUser?._id !== user?._id
                  )[0]
                }
              />
            )}
          </section>

          {/* message box */}
          <section className="min-h-0 flex-grow bg-neutral-600 rounded-md">
            {selectedChat?._id ? (
              <Messages allMessages={allMessages} />
            ) : (
              "loading..."
            )}
          </section>

          {/* message send */}
          <p className="text-sm text-red-400">{sendError}</p>
          <section className="p-2">
            <form className="flex gap-2" onSubmit={sendMessage}>
              <input
                className="flex-grow rounded px-2 py-[2px] bg-neutral-700"
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
                type="text"
                placeholder="type your message"
              />
              <button
                className="border-2 px-2 rounded border-neutral-700 hover:text-neutral-700"
                type="submit"
                disabled={buttonDisabled}
              >
                <IoSendSharp />
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
