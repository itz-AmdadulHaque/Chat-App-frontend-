import useChat from "../hooks/useChat";
import TypingIndicator from "./Loadings/TypingIndicator";

const Messages = ({ allMessages, isTyping }) => {
  const { user } = useChat();
  return (
    <div className="h-full custom-scrollbar overflow-y-auto scroll-smooth rotate-180">
      <ul className="rotate-180">
        {allMessages.length === 0 ? (
          <p className="ml-auto w-max bg-blue-900 text-right m-[3px] py-[2px] px-[10px] rounded-full">
            👋 Say hi!
          </p>
        ) : (
          allMessages.map((message, index) => {
            return (
              <li className={`w-full flex my-[5px] px-[3px]`} key={index}>
                {user?._id !== message?.sender?._id && (
                  <div
                    className={`p-[12px] mb-auto rounded-full bg-cover bg-center bg-neutral-800 ${
                      message?.chat?.isGroupChat ? "mt-[17px]" : "mt-[2px]"
                    }`}
                    style={{ backgroundImage: `url(${message?.sender?.pic})` }}
                  ></div>
                )}

                <div
                  className={`ml-[3px] min-w-0 flex-grow flex flex-col`}
                >
                  {user?._id !== message?.sender?._id &&
                    message?.chat?.isGroupChat && (
                      <p className="ml-[2px] text-[10px] text-neutral-400">
                        {message?.sender?.name}
                      </p>
                    )}
                  <p
                    className={`py-[2px] px-[10px] rounded-xl w-max max-w-[90%] md:max-w-[47%] overflow-wrap break-words  ${
                      user?._id === message?.sender?._id
                        ? "bg-blue-900 ml-auto"
                        : "bg-yellow-700"
                    } `}
                  >
                    {message?.content}
                  </p>
                </div>
              </li>
            );
          })
        )}

        {/* typing indicator */}
        <li>{isTyping && <TypingIndicator />}</li>
      </ul>
    </div>
  );
};

export default Messages;
