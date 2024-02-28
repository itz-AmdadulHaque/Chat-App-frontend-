import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useChat from "../../hooks/useChat.js"
import {axiosPrivate} from "../../api/axios.js"

const Login = () => {
  const navigate = useNavigate();
  const {setUser, setToken} = useChat()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [disable, setDisable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    setMessage("Loading... Please wait");

    try {
      const {data} = await axiosPrivate.post(
        "/users/login",
        {
          email,
          password,
        },
      );
      console.log(data);
      setUser(data?.data?.user)
      setToken(data?.data?.accessToken)
      setMessage(data.message);

      navigate("/chat", { replace: true });
    } catch (error) {
      console.log("////error: \n", error);
      setMessage(error?.response?.data?.message);
      setDisable(false);
    }
  };

  return (
    <div>
      <form className="grid gap-2" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold">login</h1>
        {message && <p>{message}</p>}

        <input
        className="text-black"
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
        className="text-black"
          type="password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className={`bg-blue-300 rounded px-10 py-2 border-2 ${
            !disable ? "hover:bg-white hover:border-blue-300" : ""
          }`}
          type="submit"
          disabled={disable}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
