const chatName = (logedUserId, users)=>{
    // console.log(users[0]._id, " ///", logedUserId)
    return users[0]._id === logedUserId? users[1].name: users[0].name
}

export default chatName