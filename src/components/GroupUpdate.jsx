import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useChat from "../hooks/useChat";
import { BiSolidEdit } from "react-icons/bi";
import { CiCircleRemove } from "react-icons/ci";

const GroupUpdate = ({ setViewDetail }) => {
  const axiosPrivate = useAxiosPrivate();
  const { user, selectedChat, setSelectedChat, setChats } = useChat();

  const [groupName, setGroupName] = useState(selectedChat?.chatName ?? "");
  const [searchValue, setSearchValue] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
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

      const { data } = await axiosPrivate.put("chat/removeFromGroup", {
        chatId: selectedChat?._id,
        userId: userId,
      });

      setSelectedChat((pre)=>{
        const newUser = (pre?.users).filter((user)=> user?._id !== userId)
        return {...pre, users: newUser}
      })
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
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get(
        `/users/allUser?search=${searchValue}`
      );

      console.log("users: \n", data);
      setSearchUsers(data?.data);
      setLoading(false);
    } catch (error) {
      console.log(error?.message);
      setLoading(false);
    }
  };

  const handleAdd = (isChecked, newUser) => {
    if (isChecked) {
      newUser.isChecked = true; // adding a new property
      setSelectedUsers((pre) => [...pre, newUser]);
    } else {
      newUser.isChecked = false;
      setSelectedUsers((pre) => pre.filter((user) => user._id !== newUser._id));
    }
  };

  return (
    <div className="absolute h-screen w-screen top-0 right-0 flex justify-center items-center backdrop-blur-sm">
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

        {/* user added list */}
        <section className="max-h-28">
          <ul className="h-full flex gap-4 custom-scrollbar overflow-x-auto overflow-y-hidden">
            {selectedUsers.map((user) => {
              return (
                <li
                  className="relative flex flex-col items-center py-2"
                  onClick={() => handleAdd(false, user)}
                  key={user?._id}
                >
                  <div
                    className="w-6 h-6 bg-cover bg-center rounded-full"
                    style={{ backgroundImage: `url(${user?.pic})` }}
                  ></div>
                  <p className="text-sm">{user?.name}</p>
                  <button className="absolute top-[-6px] right-[-6px] text-red-600 text-xl">
                    x
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

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
          <ul className="h-full overflow-x-hidden custom-scrollbar overflow-y-auto">
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

                  {/* remove button apear only for admid */}
                  {(selectedChat?.groupAdmin?._id === user?._id) && (user?._id !== eachUser?._id) && (
                    <button className="p-[4px] text-2xl text-red-600 hover:text-red-400" onClick={()=>handleRemove(eachUser?._id)} disabled={buttonDisable}>
                      <CiCircleRemove />
                    </button>
                  )}

                  {/* show admin not the button */}
                  {(user?._id == eachUser?._id) && <p className="text-sm text-neutral-400">Admin</p>}
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
              {loading ? (
                <p className="px-2">Loading...</p>
              ) : (
                <ul className=" h-full overflow-x-hidden custom-scrollbar overflow-y-auto">
                  {searchUsers.map((user) => {
                    return (
                      <li
                        className="mt-1 px-4  bg-neutral-700 flex justify-between items-center"
                        key={user?._id}
                      >
                        <label
                          className=" flex-grow flex items-center gap-2"
                          htmlFor={user?._id}
                        >
                          <div
                            className={`w-8 h-8  rounded-full bg-cover bg-center bg-neutral-800`}
                            style={{ backgroundImage: `url(${user?.pic})` }}
                          ></div>
                          <div>
                            <p>{user?.name}</p>
                            <p className="text-xs font-light">{user?.email}</p>
                          </div>
                        </label>

                        <input
                          className="w-4 h-4 bg-black"
                          type="checkbox"
                          checked={
                            user?.isChecked ||
                            selectedUsers.find(
                              (selectedUser) => selectedUser?._id === user?._id
                            ) ||
                            false
                          }
                          // user initially not have the isChecked property, adding this
                          id={user?._id}
                          onChange={(e) => {
                            handleAdd(e.target.checked, user);
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupUpdate;
