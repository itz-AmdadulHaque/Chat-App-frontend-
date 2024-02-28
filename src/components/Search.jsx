import { BsSearch } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SpinnerCenter from "./Loadings/SpinnerCenter";
import useChat from "../hooks/useChat";

const Search = () => {
  const axiosPrivate = useAxiosPrivate();
  const {setChats} = useChat()

  const [search, setSearch] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get(`/users/allUser?search=${value}`);

      console.log("users: \n", data);
      setUsers(data?.data);
      setLoading(false);
    } catch (error) {
      console.log(error?.message);
      setLoading(false);
    }
  };
  const handleAddChat = async (userId) => {
    try{
      setChatLoading(true)
      const {data} = await axiosPrivate.post('/chat', {userId: userId})
      console.log(data)

      setChats(pre=> {
        const chatExists = pre.find(
          (chat) => chat?.users?.some((user) => user._id === userId)
        );
        return chatExists? pre: [data?.data, ...pre]
      })
      setChatLoading(false)
      setValue("")
      setUsers([])
      setSearch(false)
    }catch(error){
      console.log(error)
      setChatLoading(false)
    }
  };
  return (
    <div className="flex flex-col">
      <button
        className="flex gap-2 items-center p-2 w-max border-2 rounded-md border-neutral-600 bg-neutral-600 hover:border-neutral-500"
        onClick={() => setSearch((pre) => !pre)}
      >
        <BsSearch /> Search for friends
      </button>

      {search && (
        <div className="bg-neutral-600 px-4 pt-4 pb-2 w-screen sm:w-[320px] absolute top-0 left-0 h-screen flex flex-col">
          <form className="flex gap-2 justify-center" onSubmit={handleSearch}>
            <input
              className="bg-neutral-600 border-2 border-neutral-500 rounded-md px-2"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Name or Email"
            />
            <button
              className="px-2 py-[4px] border-2 border-neutral-500 rounded-md bg-neutral-600 hover:border-neutral-700"
              type="submit"
            >
              <BsSearch />
            </button>
            <button
              className="text-red-700 hover:text-neutral-500 text-2xl"
              onClick={() => {
                setSearch(false);
                setValue("");
                setUsers([]);
              }}
            >
              <RxCross2 />
            </button>
          </form>
          <hr className="mt-2 border-neutral-800" />

          {/* for loading */}
          {loading && <p>Loading...</p>}
          {users.length <= 0 && !loading && <p>No user found</p>}

          {/* found users */}
          <ul className="custom-scrollbar flex-grow overflow-x-hidden overflow-y-auto scroll-smooth">
            {users.map((user) => {
              return (
                <li
                  onClick={()=> handleAddChat(user?._id)}
                  className="relative p-2 my-2 bg-neutral-700 hover:bg-neutral-800 flex items-center gap-2"
                  key={user?._id}
                  disabled = {chatLoading}
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-cover bg-center bg-neutral-800`}
                    style={{ backgroundImage: `url(${user?.pic})` }}
                  ></div>
                  <div>
                    <h3 className="font-semibold">{user?.name}</h3>
                    <p className="text-neutral-400 text-sm">{user?.email}</p>
                  </div>
                </li>
              );
            })}
            {chatLoading && <SpinnerCenter/>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
