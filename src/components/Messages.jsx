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
              <li
                className={`w-full h-max flex gap-[1px] items-center `}
                key={index}
              >
                {user?._id !== message?.sender?._id && (
                  <div
                    className={`w-6 h-6 rounded-full bg-cover bg-center bg-neutral-800`}
                    style={{ backgroundImage: `url(${message?.sender?.pic})` }}
                  ></div>
                )}

                <p
                  className={`m-[3px] py-[2px] px-[10px] rounded-xl w-max max-w-[90%] md:max-w-[47%] overflow-wrap break-words  ${
                    user?._id === message?.sender?._id
                      ? "bg-blue-900 ml-auto"
                      : "bg-yellow-700"
                  } `}
                >
                  {message?.content}
                </p>
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
