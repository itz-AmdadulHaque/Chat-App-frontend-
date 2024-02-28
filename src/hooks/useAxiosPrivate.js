import { useEffect } from "react";
import { axiosPrivate } from "../api/axios.js";
import useRefreshToken from "../hooks/useRefreshToken.js";
import useChat from "./useChat.js";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { token } = useChat();

  useEffect(() => {
    // interceptor is like middlewar of axios api, can modify req and res
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        // 403 is set in backend verify middleware when access token expired
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true; // adding 'sent' property

          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosPrivate(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [token, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
