
const messageHilight = (notification, chatId) => {
    // console.log("Notification", notification.some(message => message?.chat?._id === chatId))
    
    return notification.some(message => message?.chat?._id === chatId) || false;
}

export default messageHilight