import { IoSendSharp } from "react-icons/io5";
import useChat from "../hooks/useChat";
import chatName from "../utils/chatName";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import GroupUpdate from "./GroupUpdate";
import ProfileModel from "./ProfileModel";
import Messages from "./Messages";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SpinnerCenter from "./Loadings/SpinnerCenter";

const Chatbox = ({ socket, socketConnected }) => {
  const { user, chats, setChats,allMessages, setAllMessages, selectedChat, setSelectedChat, notification, setNotification, isMobile } = useChat();
  const axiosPrivate = useAxiosPrivate();

  const [viewDetail, setViewDetail] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [sendError, setSendError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const typingTimeoutRef = useRef(null);

  // get all the messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get(`/messages/${selectedChat?._id}`);
      // console.log("Messages", data);

      setAllMessages(data?.data);
      setLoading(false);
      setMessageError("");
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setLoading(false);
      setMessageError(errorMessage);
    }
  };
  useEffect(() => {
    if (Object.keys(selectedChat).length !== 0) {
      fetchMessages();
    }
  }, [selectedChat]);

  // adding typing indicator events
  useEffect(() => {
    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);

    if (socketConnected && socket && selectedChat._id) {
      // console.log("Typing add for:", selectedChat?.chatName);
      socket.emit("join chat", selectedChat?._id);
      socket.on("typing", handleTyping);
      socket.on("stop typing", handleStopTyping);
    }

    return () => {
      if (socketConnected && socket && selectedChat._id) {
        // console.log("Typing remove:", selectedChat?.chatName);

        socket.off("typing", handleTyping);
        socket.off("stop typing", handleStopTyping);
      }
    };
  }, [socketConnected, socket, selectedChat]);

  //send message
  const sendMessage = async (e) => {
    e.preventDefault();
    setSendError("");

    try {
      setButtonDisabled(true);

      // turn the typing indicator off
      socket.emit("stop typing", selectedChat._id);
      setIsTyping(false);

      // send message
      const { data } = await axiosPrivate.post("/messages/", {
        chatId: selectedChat?._id,
        content: messageValue,
      });
      // console.log(data);

      // emiting message so everyone recieve it in realtime
      socket.emit("new message", data?.data);

      setAllMessages((preMessage) => [...preMessage, data?.data]);
      setMessageValue("");
      setButtonDisabled(false);

      //set this chat to top of chat list
      setChats((preChats) => {
        const filterChats = preChats.filter(
          (chat) => chat?._id !== selectedChat?._id
        );
        selectedChat.latestMessage = data?.data
        return [selectedChat, ...filterChats];
      });
      localStorage.setItem(`${user?._id}`, "0"); // this chat is now in top
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message ||
        "Sending failed, check internet connection";

      setButtonDisabled(false);
      setSendError(errorMessage);
      setIsTyping(false);
      socket.emit("stop typing", selectedChat._id);
    }
  };

  // for typing indicator
  const typingHandler = (e) => {
    setMessageValue(e.target.value);

    if (!socket.connected) return;

    // Clear timeout only if there's an existing one
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socket.emit("typing", selectedChat._id);

    const timerLength = 2000;

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setIsTyping(false);
    }, timerLength);
  };

  // Cleanup effect to clear timeout on unmount (typing timer)
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`min-w-0 px-2 w-full flex-grow bg-neutral-800 ${
        isMobile && Object.keys(selectedChat).length === 0 && "hidden"
      }`}
    >
      {selectedChat && Object.keys(selectedChat).length === 0 ? (
        <div className="h-full flex flex-col justify-center items-center">
          <p>Search and Select a User to Chat</p>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* chat name and detail icon option */}
          <section className="p-2 flex justify-between items-center">
            <div className="flex items-center gap-1">
              {/* out of chat buttun on mobile view */}
              <button
                className="px-[4px]  hover:text-red-300 sm:hidden"
                onClick={() => {
                  setSelectedChat({});
                  setMessageValue("");
                  localStorage.removeItem(`${user?._id}`);
                  socket.emit("leave chat", selectedChat?._id);
                }}
              >
                <BiArrowBack />
              </button>

              {/* name of chat */}
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
          <section className="min-h-0 flex-grow bg-neutral-600 rounded-md relative">
            {!selectedChat?._id || loading ? (
              <SpinnerCenter />
            ) : messageError ? (
              <div className="h-full flex justify-center items-center">
                <p className="text-xl text-red-500">{messageError}</p>
              </div>
            ) : (
              <Messages allMessages={allMessages} isTyping={isTyping} />
            )}
          </section>

          {/* message send */}
          <p className="text-sm text-red-400">{sendError}</p>
          <section className="p-2">
            <form className="flex gap-2" onSubmit={sendMessage}>
              <input
                className="flex-grow rounded px-2 py-[2px] bg-neutral-700"
                value={messageValue}
                onChange={(e) => typingHandler(e)}
                type="text"
                placeholder="type your message"
              />
              <button
                className="border-2 px-2 rounded border-neutral-700 hover:text-neutral-700"
                type="submit"
                disabled={buttonDisabled || !messageValue}
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
