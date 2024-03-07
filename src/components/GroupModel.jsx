import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useChat from "../hooks/useChat";

const GroupModel = ({ setGroupClick }) => {
  const axiosPrivate = useAxiosPrivate();
  const { setChats, setSelectedChat } = useChat();

  const [groupName, setGroupName] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errorMesage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleCreateGroup = async () => {
    setErrorMessage("Creating Group, Please wait...");
    try {
      const { data } = await axiosPrivate.post("/chat/group", {
        name: groupName,
        users: selectedUsers.map((user) => user._id),
      });

      console.log(data);
      setChats((pre) => [data?.data, ...pre]);

      localStorage.setItem("selectedChatIndex", "0");
      setSelectedChat(data?.data);
      setGroupClick(false);
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="absolute h-screen w-screen top-0 right-0 flex justify-center items-center backdrop-blur-sm">
      <div className="flex flex-col w-screen h-screen sm:w-[310px] sm:h-[70%] p-2 border-2 rounded-md bg-neutral-800">
        {/* heading */}
        <section className="relative pt-2 pb-6">
          <h3 className="text-xl text-center">Create Group</h3>
          <button
            className="absolute top-[-4px] right-[-4px] text-red-700 text-xl border-2 border-stone-700 hover:border-stone-600"
            onClick={() => setGroupClick(false)}
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

        {/* input to create group */}
        <section className="my-2 flex gap-2 justify-center">
          <input
            className="px-2 py-[2px] rounded bg-neutral-700"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
          />
          <button
            className="px-2 bg-neutral-700 border-2 border-neutral-600 hover:border-neutral-500"
            onClick={handleCreateGroup}
          >
            Create
          </button>
        </section>

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
      </div>
    </div>
  );
};

export default GroupModel;
