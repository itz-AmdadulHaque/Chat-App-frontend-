import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useChat from "../hooks/useChat";
import { BiSolidEdit } from "react-icons/bi";
import { CiCircleRemove } from "react-icons/ci";
import { MdAddCircleOutline } from "react-icons/md";

const GroupUpdate = ({ setViewDetail }) => {
  const axiosPrivate = useAxiosPrivate();
  const { user, selectedChat, setSelectedChat, chats, setChats } = useChat();

  const [groupName, setGroupName] = useState(selectedChat?.chatName ?? "");
  const [searchValue, setSearchValue] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchMessage, setSearchMessage] = useState("Search for friend");
  const [showMemebers, setShowMembers] = useState(true);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errorMesage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRenameGroup = async () => {
    setErrorMessage("Renaming Group, Please wait...");
    setButtonDisable(true);

    try {
      const { data } = await axiosPrivate.put("/chat/renameGroup", {
        chatId: selectedChat?._id,
        chatName: groupName,
      });

      console.log(data);

      setGroupName(data?.data?.chatName);
      setIsEdit(false);
      setButtonDisable(false);
      setErrorMessage("");
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setErrorMessage(errorMessage);
      setButtonDisable(false);
      setErrorMessage("");
    }
  };

  // only admine can see the remove option and remove
  const handleRemove = async (userId) => {
    try {
      setErrorMessage("Wait Removing a Member...");
      setButtonDisable(true);

      const { data } = await axiosPrivate.put("/chat/removeFromGroup", {
        chatId: selectedChat?._id,
        userId: userId,
      });

      setSelectedChat((pre) => {
        const newUsers = (pre?.users).filter((user) => user?._id !== userId);
        return { ...pre, users: newUsers };
      });
      console.log(data?.data);
      setErrorMessage("");
      setButtonDisable(false);
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setErrorMessage(errorMessage);
      setButtonDisable(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setButtonDisable(true);
    setSearchMessage("Loading...");
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get(
        `/users/allUser?search=${searchValue}`
      );
      console.log("users: \n", data);

      //filter the group members from search users list
      const filterSearchUser = (data?.data).filter((EachUser) => {
        return !(selectedChat?.users).some(
          (member) => member?._id === EachUser?._id
        );
      });

      if (filterSearchUser.length === 0) {
        setSearchMessage("No user Found");
      } else {
        setSearchMessage("");
      }
      
      setSearchUsers(filterSearchUser);
      setLoading(false);
      setButtonDisable(false);
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message || "An error occurred.";

      setErrorMessage(errorMessage);
      setLoading(false);
      setButtonDisable(false);
    }
  };

  const handleAdd = async (NewMember) => {
    try {
      setErrorMessage("Wait Adding a Member...");
      setButtonDisable(true);

      const { data } = await axiosPrivate.put("chat/addToGroup", {
        chatId: selectedChat?._id,
        userId: NewMember?._id,
      });
      console.log(data);

      setSearchUsers((pre) =>
        pre.filter((eachUser) => eachUser?._id !== NewMember?._id)
      );

      setSelectedChat((pre) => {
        const newUser = [NewMember, ...pre?.users];
        return { ...pre, users: newUser };
      });

      setErrorMessage("");
      setButtonDisable(false);
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setErrorMessage(errorMessage);
      setButtonDisable(false);
    }
  };

  // users not admin can leave group
  const handleLeave = async () => {
    try {
      setErrorMessage("Wait, Leaving from the Group...");
      setButtonDisable(true);

      const { data } = await axiosPrivate.delete("chat/leaveGroup", {
        // data property must have to be added to send the paloaded data in delete method
        data: {
          chatId: selectedChat?._id,
        },
      });
      console.log(data);

      // removing the group chat from chat list and make next chat as selected chat
      setChats((prevChats) => {
        if (prevChats.length === 1) {
          setSelectedChat({});
        } else if (
          prevChats.length > 1 &&
          prevChats[0]._id === selectedChat?._id
        ) {
          setSelectedChat(prevChats[1]);
        } else {
          setSelectedChat(prevChats[0]);
        }

        return prevChats.filter((chat) => chat?._id !== selectedChat?._id);
      });

      setErrorMessage("");
      setButtonDisable(false);
      setViewDetail(false);
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setErrorMessage(errorMessage);
      setButtonDisable(false);
    }
  };

  // only admin can delete group chat
  const handleDeleteGroup = async () => {
    try {
      setErrorMessage("Wait, Deleting the Group...");
      setButtonDisable(true);

      const { data } = await axiosPrivate.delete("chat/deleteGroup", {
        // data property must have to be added to send the paloaded data in delete method
        data: {
          chatId: selectedChat?._id,
        },
      });
      console.log(data);

      // removing from chatlist and make next chat as selected chat
      setChats((prevChats) => {
        if (prevChats.length === 1) {
          setSelectedChat({});
        } else if (
          prevChats.length > 1 &&
          prevChats[0]._id === selectedChat?._id
        ) {
          setSelectedChat(prevChats[1]);
        } else {
          setSelectedChat(prevChats[0]);
        }

        return prevChats.filter((chat) => chat?._id !== selectedChat?._id);
      });

      setErrorMessage("");
      setButtonDisable(false);
      setViewDetail(false);
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setErrorMessage(errorMessage);
      setButtonDisable(false);
    }
  };

  return (
    <div className="z-10 absolute h-screen w-screen top-0 right-0 flex justify-center items-center backdrop-blur-sm">
      <div className="flex flex-col w-screen h-screen sm:w-[310px] sm:h-[70%] py-2 px-4 border-2 rounded-md bg-neutral-800">
        {/* heading */}
        <section className="relative pt-2 pb-6">
          <h3 className="text-xl text-center">Group Detail</h3>

          <button
            className="absolute top-[-4px] right-[-4px] text-red-700 text-xl border-2 border-stone-700 hover:border-stone-600"
            onClick={() => setViewDetail(false)}
          >
            <RxCross2 />
          </button>
        </section>

        {/* error message */}
        {errorMesage && (
          <p className="text-center text-red-600">{errorMesage}</p>
        )}

        {/* rename group*/}
        <section className="my-2 flex gap-2 justify-center">
          {isEdit ? (
            <>
              <input
                className="px-2 py-[2px] rounded bg-neutral-700"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
              />
              <button
                className="px-2 bg-neutral-700 border-2 border-neutral-600 hover:border-neutral-500"
                onClick={handleRenameGroup}
                disabled={buttonDisable}
              >
                Change
              </button>
            </>
          ) : (
            <>
              <p>Name: {groupName}</p>
              <button
                className="px-2 hover:text-green-300"
                onClick={() => setIsEdit((pre) => !pre)}
              >
                <BiSolidEdit />
              </button>
            </>
          )}
        </section>

        {/* buttons showing members or add user */}
        <section className="flex gap-2 justify-center">
          <button
            className={
              showMemebers
                ? "px-2 rounded border-2 border-neutral-700  bg-neutral-700"
                : "px-2 rounded border-2 border-neutral-700 hover:border-neutral-600"
            }
            onClick={() => setShowMembers(true)}
          >
            Members
          </button>

          <button
            className={
              !showMemebers
                ? "px-2 rounded border-2 border-neutral-700 bg-neutral-700 "
                : "px-2 rounded border-2 border-neutral-700 hover:border-neutral-600"
            }
            onClick={() => setShowMembers(false)}
          >
            Add Members
          </button>
        </section>

        {showMemebers ? (
          <ul className="h-full mt-1 overflow-x-hidden custom-scrollbar overflow-y-auto">
            {selectedChat?.users.map((eachUser) => {
              return (
                <li
                  className="mt-1 px-4  bg-neutral-700 flex justify-between items-center"
                  key={eachUser?._id}
                >
                  <div
                    className=" flex-grow flex items-center gap-2"
                    htmlFor={eachUser?._id}
                  >
                    <div
                      className={`w-8 h-8  rounded-full bg-cover bg-center bg-neutral-800`}
                      style={{ backgroundImage: `url(${eachUser?.pic})` }}
                    ></div>
                    <div>
                      <p>{eachUser?.name}</p>
                      <p className="text-xs font-light">{eachUser?.email}</p>
                    </div>
                  </div>

                  {/* remove button apear only for admin */}
                  {selectedChat?.groupAdmin?._id === user?._id &&
                    user?._id !== eachUser?._id && (
                      <button
                        className="p-[4px] text-2xl text-red-600 hover:text-red-400"
                        onClick={() => handleRemove(eachUser?._id)}
                        disabled={buttonDisable}
                      >
                        <CiCircleRemove />
                      </button>
                    )}

                  {/* show admin not the button */}
                  {user?._id == eachUser?._id && (
                    <p className="text-sm text-neutral-400">Admin</p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <>
            {/* form for searching user */}
            <form
              onSubmit={handleSearch}
              className="my-2 flex gap-2 justify-center"
            >
              <input
                className="px-2 py-[2px] rounded bg-neutral-700"
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search user"
              />
              <button
                type="submit"
                className="px-2 bg-neutral-700 border-2 border-neutral-600 hover:border-neutral-500"
              >
                Search
              </button>
            </form>

            {/* search users list */}
            <section className="min-h-0 flex-grow">
              {loading || searchUsers.length === 0 ? (
                <p className="px-2">{searchMessage}</p>
              ) : (
                <ul className=" h-full mt-1 overflow-x-hidden custom-scrollbar overflow-y-auto">
                  {searchUsers.map((eachUser) => {
                    return (
                      <li
                        className="mt-1 px-4 bg-neutral-700 flex justify-between items-center"
                        key={eachUser?._id}
                      >
                        <div className="flex gap-2 items-center">
                          <div
                            className={`w-8 h-8  rounded-full bg-cover bg-center bg-neutral-800`}
                            style={{ backgroundImage: `url(${eachUser?.pic})` }}
                          ></div>
                          <div>
                            <p>{eachUser?.name}</p>
                            <p className="text-xs font-light">
                              {eachUser?.email}
                            </p>
                          </div>
                        </div>

                        <button
                          className=" pl-2 py-[4px] text-green-500 text-2xl hover:text-green-300"
                          onClick={() => handleAdd(eachUser)}
                          disabled={buttonDisable}
                        >
                          <MdAddCircleOutline />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}

        {selectedChat?.groupAdmin?._id === user?._id ? (
          <button
            className="bg-red-700 hover:bg-red-600"
            onClick={handleDeleteGroup}
            disabled={buttonDisable}
          >
            Delete
          </button>
        ) : (
          <button
            className="bg-red-700 hover:bg-red-600"
            disabled={buttonDisable}
            onClick={handleLeave}
          >
            Leave
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupUpdate;
