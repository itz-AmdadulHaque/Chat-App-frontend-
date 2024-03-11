import {BrowserRouter, Route, Routes} from "react-router-dom"
import "./App.css";
import Home from "./Pages/Home";
import ChatPage from "./Pages/ChatPage";
import NotFound from "./Pages/NotFound";
import useChat from "./hooks/useChat";
import { useEffect } from "react";

function App() {
  const { setIsMobile } = useChat();

  useEffect(() => {
    const handleResize = () => {

      const width = window.innerWidth;
      setIsMobile(width <= 576); // Adjust breakpoint as needed

      console.log(width)
    };

    window.addEventListener("resize", handleResize);

    handleResize(); // Call initially to set state on component mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
