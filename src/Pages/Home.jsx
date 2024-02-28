import React, { useState } from "react";
import Login from "../components/Authentication/Login";
import Singup from "../components/Authentication/Signup";

const Home = () => {
  const [login, setLogin] = useState(true);
  return (
    <div className="bg-neutral-700 h-screen flex flex-col">
      <div className="bg-red-300 p-4 m-auto">
        <div className="flex gap-4">
          <button
            className="bg-blue-300 font-bold text-2xl rounded px-10 py-2 border-2 hover:bg-white hover:border-blue-300"
            onClick={() => setLogin(true)}
            disabled = {!setLogin}
          >
            Login
          </button>
          <button
            className="bg-blue-300 rounded px-10 py-2 border-2 hover:bg-white hover:border-blue-300"
            onClick={() => setLogin(false)}
          >
            Signup
          </button>
        </div>
        <div>{login ? <Login /> : <Singup />}</div>
      </div>
    </div>
  );
};

export default Home;
