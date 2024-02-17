import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [disable, setDisable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    setMessage("Loading... Please wait");

    try {
      const URL = import.meta.env.VITE_BASE_URL; //alway use this to access env in vite, "VITE_NAME"
      // console.log("url: ",URL)
      const response = await axios.post(
        `${URL}/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // must needed to include cookies in cross-origin requests.
        }
      );
      console.log(response.data);
      setMessage(response.data.message);

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
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
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
