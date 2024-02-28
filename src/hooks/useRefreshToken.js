import axios from "../api/axios";
import useChat from "./useChat";

const useRefreshToken = () => {
  const { setToken } = useChat();

  const refresh = async () => {
    const { data } = await axios.get("/users/refresh", {
      withCredentials: true,
    });
    console.log("useRerfresh: ", data?.data?.accessToken)
    setToken(data?.data?.accessToken);

    return data?.data?.accessToken;
  };

  return refresh; //return function
};

export default useRefreshToken;
