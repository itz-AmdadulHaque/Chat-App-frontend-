import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import useChat from "../../hooks/useChat.js";
import { axiosPrivate } from "../../api/axios.js";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useChat();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [disable, setDisable] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    setMessage("Loading... Please wait");

    try {
      const { data } = await axiosPrivate.post("/users/login", {
        email,
        password,
      });
      console.log(data);
      setUser(data?.data?.user);
      setToken(data?.data?.accessToken);
      setMessage(data.message);

      navigate("/chat", { replace: true });
    } catch (error) {
      console.log("////error: \n", error);
      setMessage(error?.response?.data?.message);
      setDisable(false);
    }
  };

  return (
    <form className="grid gap-2 p-2" onSubmit={handleSubmit}>
      {message && <p className="text-red-600 text-center">{message}</p>}
      <input
        className="bg-neutral-500 px-2 py-[4px] rounded"
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="bg-neutral-500 px-2 py-[4px] rounded"
        type="password"
        placeholder="Your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        className={`font-semibold bg-neutral-700 border-2 border-neutral-700 px-2 py-[4px] rounded ${
          !disable ? "hover:border-neutral-500" : ""
        }`}
        type="submit"
        disabled={disable}
      >
        Login
      </button>
    </form>
  );
};

export default Login;
