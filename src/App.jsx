import {BrowserRouter, Route, Routes} from "react-router-dom"

import "./App.css";
import Home from "./Pages/Home";
import ChatPage from "./Pages/ChatPage";
import NotFound from "./Pages/NotFound";

function App() {

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
