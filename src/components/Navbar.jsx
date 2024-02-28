import { useState } from "react";
import Search from "./Search";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useChat from "../hooks/useChat";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const axiosPrivate = useAxiosPrivate();
  const { user, setUser, setToken } = useChat();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    try {
      const { data } = await axiosPrivate.get("/users/logout");

      console.log(data);
      setUser({});
      setToken("");

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="flex items-center justify-between py-2 px-4 bg-neutral-800">
      <div className="hidden md:block">
        <Search />
      </div>

      <h1 className="flex items-center gap-2 text-2xl text-neutral-400 font-semibold">
        <div className="w-6 h-6 bg-[url('/favicon.ico')] bg-contain relative bottom-[-2px]"></div>
        Shadow-Talk
      </h1>

      {/* user profile icon */}
      <div className="relative">
        {/* image */}
        <div
          className="w-8 h-8 rounded-full bg-cover bg-center bg-neutral-900"
          style={{ backgroundImage: `url(${user?.pic})` }}
          onClick={() => setShowProfile((pre) => !pre)}
        ></div>

        {/* dropdown */}
        {showProfile && (
          <div className="w-24 p-2 mt-[2px] grid text-left absolute right-0 bg-neutral-900">
            <button className="p-2 hover:bg-neutral-700">Profile</button>
            <button className="p-2 hover:bg-neutral-700" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* profile detail */}
      
    </nav>
  );
};

export default Navbar;
