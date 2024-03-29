import { useState } from "react";
import Search from "./Search";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useChat from "../hooks/useChat";
import { useNavigate } from "react-router-dom";
import ProfileModel from "./ProfileModel";
import SpinnerCenter from "./Loadings/SpinnerCenter";
const Navbar = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    user,
    setUser,
    setToken,
    setChats,
    setSelectedChat,
    notification,
    setNotification,
  } = useChat();
  const navigate = useNavigate();

  const [showDetail, setShowDetail] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);

  const handleLogout = async () => {
    try {
      setButtonDisable(true);
      const { data } = await axiosPrivate.get("/users/logout");
      localStorage.removeItem(`${user?._id}`);
      console.log(data);

      setUser({});
      setToken("");
      setChats([]);
      setSelectedChat({});
      setNotification([]);

      setButtonDisable(false);

      navigate("/");
    } catch (error) {
      console.log(error);
      setButtonDisable(false);
    }
  };
  return (
    <nav className="flex items-center justify-between py-2 px-4 bg-neutral-800">
      {/* search option */}
      <Search />

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
          onClick={() => setShowDetail((pre) => !pre)}
        ></div>

        {/* for notification indicator */}
        <div className="absolute top-[-12px] right-[-4px] text-red-600 font-bold text-sm">
          {notification.length === 0 ? "" : notification.length}
        </div>

        {/* dropdown */}
        {showDetail && (
          <div className="w-24 p-2 mt-[2px] grid text-left absolute right-0 bg-neutral-900 z-10">
            <button
              className="p-2 hover:bg-neutral-700"
              onClick={() => setShowProfile((pre) => !pre)}
            >
              Profile
            </button>
            <button
              className="p-2 hover:bg-neutral-700 relative"
              onClick={handleLogout}
              disabled={buttonDisable}
            >
              Logout {buttonDisable && <SpinnerCenter />}
            </button>
          </div>
        )}
      </div>

      {/* profile detail */}
      {showProfile && (
        <ProfileModel setViewDetail={setShowProfile} viewUser={user} />
      )}
    </nav>
  );
};

export default Navbar;
