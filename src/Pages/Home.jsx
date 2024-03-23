import React, { useEffect, useState } from "react";
import Login from "../components/Authentication/Login";
import Singup from "../components/Authentication/Signup";

const Home = () => {
  const [login, setLogin] = useState(true);

  return (
    <div className="bg-neutral-700 h-screen flex flex-col ">
      <div className="bg-neutral-600 m-auto rounded-md w-[95%] sm:w-[400px] ">
        {/* nav */}
        <nav className=" py-2 px-4 bg-neutral-800">
          <h1 className="flex items-center justify-center gap-2 text-2xl text-neutral-400 font-semibold">
            <div className="w-6 h-6 bg-[url('/favicon.ico')] bg-contain relative bottom-[-2px]"></div>
            Shadow-Talk
          </h1>
        </nav>

        {/* button for login and signin */}
        <div className="flex gap-2 p-2">
          <button
            className={`font-semibold text-xl rounded-full flex-grow py-[4px] border-2 border-neutral-700 ${
              login
                ? "bg-neutral-700"
                : "hover:border-neutral-700 hover:bg-neutral-700"
            }`}
            onClick={() => setLogin(true)}
            disabled={login}
          >
            Login
          </button>
          <button
            className={`font-semibold text-xl rounded-full flex-grow py-[4px] border-2 border-neutral-700 ${
              !login
                ? "bg-neutral-700"
                : "hover:border-neutral-700 hover:bg-neutral-700"
            }`}
            onClick={() => setLogin(false)}
            disabled={!login}
          >
            Signup
          </button>
        </div>

        {/* form fror login or signin */}
        {login ? <Login /> : <Singup />}
      </div>
    </div>
  );
};

export default Home;
