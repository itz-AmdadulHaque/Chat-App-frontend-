import useChat from "../hooks/useChat";
import TypingIndicator from "./Loadings/TypingIndicator";

const Messages = ({ allMessages, isTyping }) => {
  const { user } = useChat();
  return (
    <div className="h-full custom-scrollbar overflow-y-auto scroll-smooth rotate-180">
      <ul className="rotate-180">
        {allMessages.map((message, index) => {
          return (
            <li
              className={`w-max flex gap-[1px] items-center  ${
                user?._id === message?.sender?._id ? "ml-auto" : ""
              } `}
              key={index}
            >
              {user?._id !== message?.sender?._id && (
                <div
                  className={`w-6 h-6 rounded-full bg-cover bg-center bg-neutral-800`}
                  style={{ backgroundImage: `url(${message?.sender?.pic})` }}
                ></div>
              )}

              <p
                className={`m-[3px] py-[2px] px-[10px] rounded-full ${
                  user?._id === message?.sender?._id
                    ? "bg-blue-900"
                    : "bg-yellow-700"
                } `}
              >
                {message?.content}
              </p>
            </li>
          );
        })}

        {/* typing indicator */}
        <li>{isTyping && <TypingIndicator />}</li>
      </ul>
    </div>
  );
};

export default Messages;
