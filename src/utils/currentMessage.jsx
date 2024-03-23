function currentMessage(chat, userId) {
  if (!chat?.latestMessage?.content) {
    return "👋Say Hi!";
  }

  const chatMessage = chat?.isGroupChat
    ? `${userId === chat?.latestMessage?.sender?._id ? "You": chat?.latestMessage?.sender?.name}: ${chat?.latestMessage?.content}`
    : `${userId === chat?.latestMessage?.sender?._id ? "You: " : ""}${chat?.latestMessage?.content}`;

  return chatMessage.length <= 18
    ? chatMessage
    : chatMessage.substring(0, 15) + "...";
}

export default currentMessage;
