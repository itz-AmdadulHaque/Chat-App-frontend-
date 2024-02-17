import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Singup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState(null);
  const [message, setMessage] = useState("");
  const [disable, setDisable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    setMessage("Loading... Please wait");
    if (password !== confirmpassword) {
      setMessage("Confirm password does not match");
      setDisable(false);
      return;
    }
    try {
      const URL = import.meta.env.VITE_BASE_URL; //alway use this to access env in vite, "VITE_NAME"
      // console.log("url: ",URL)
      const response = await axios.post(
        `${URL}/users/register`,
        {
          name,
          email,
          password,
          pic: pic || "",
        },
        {
          withCredentials: true, // must needed to include cookies in cross-origin requests.
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
        <h1 className="text-2xl font-bold">signup</h1>
        {message && <p>{message}</p>}

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <input
          type="password"
          placeholder="Comfirm Password"
          value={confirmpassword}
          onChange={(e) => setConfirmpassword(e.target.value)}
          required
        />

        <label className="font-bold" htmlFor="pic">
          Upload image
        </label>
        <input
          type="file"
          accept="image/*"
          id="pic"
          onChange={(e) => {
            setPic(e.target.files[0]);
            console.log(e.target.files[0]);
          }}
        />
        <button
          className={`bg-blue-300 rounded px-10 py-2 border-2 ${
            !disable ? "hover:bg-white hover:border-blue-300" : ""
          }`}
          type="submit"
          disabled={disable}
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Singup;
