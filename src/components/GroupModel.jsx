import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useChat from "../hooks/useChat";

const GroupModel = ({ setGroupClick }) => {
  const axiosPrivate = useAxiosPrivate();
  const { user, setChats, setSelectedChat } = useChat();

  const [groupName, setGroupName] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchMessage, setSearchMessage] = useState("Search for friend");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errorMesage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSearchMessage("Loading...")

      const { data } = await axiosPrivate.get(
        `/users/allUser?search=${searchValue}`
      );

      if (data?.data.length === 0) {
        setSearchMessage("No user Found");
      } else {
        setSearchMessage("");
      }

      console.log("users: \n", data);
      setSearchUsers(data?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      // Access specific error message if available
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setErrorMessage(errorMessage);
      setLoading(false);
    }
  };

  const handleAdd = (isChecked, newUser) => {
    if (isChecked) {
      newUser.isChecked = true; // adding a new property
      setSelectedUsers((pre) => [...pre, newUser]);
    } else {
      newUser.isChecked = false;
      setSelectedUsers((pre) => pre.filter((eachUser) => eachUser._id !== newUser._id));
    }
  };

  const handleCreateGroup = async () => {
    setErrorMessage("Creating Group, Please wait...");
    try {
      const { data } = await axiosPrivate.post("/chat/group", {
        name: groupName,
        users: selectedUsers.map((eachUser) => eachUser._id),
      });

      console.log(data);
      setChats((pre) => [data?.data, ...pre]);

      // store index selected chat index
      localStorage.setItem(`${user?._id}`, "0");

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
    <div className="z-10 absolute h-screen w-screen top-0 right-0 flex justify-center items-center backdrop-blur-sm">
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
            {selectedUsers.map((eachUser) => {
              return (
                <li
                  className="relative flex flex-col items-center py-2"
                  onClick={() => handleAdd(false, eachUser)}
                  key={eachUser?._id}
                >
                  <div
                    className="w-6 h-6 bg-cover bg-center rounded-full"
                    style={{ backgroundImage: `url(${eachUser?.pic})` }}
                  ></div>
                  <p className="text-sm">{eachUser?.name}</p>
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
          {loading || searchUsers.length === 0 ? (
            <p className="px-2">{searchMessage}</p>
          ) : (
            <ul className=" h-full overflow-x-hidden custom-scrollbar overflow-y-auto">
              {searchUsers.map((eachUser) => {
                return (
                  <li
                    className="mt-1 px-4  bg-neutral-700 flex justify-between items-center"
                    key={eachUser?._id}
                  >
                    <label
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
                    </label>

                    <input
                      className="w-4 h-4 bg-black"
                      type="checkbox"
                      checked={
                        eachUser?.isChecked ||
                        selectedUsers.find(
                          (selectedUser) => selectedUser?._id === eachUser?._id
                        ) ||
                        false
                      }
                      // eachUser initially not have the isChecked property, adding this
                      id={eachUser?._id}
                      onChange={(e) => {
                        handleAdd(e.target.checked, eachUser);
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
