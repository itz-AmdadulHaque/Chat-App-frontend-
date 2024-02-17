import {BrowserRouter, Route, Routes} from "react-router-dom"

import "./App.css";
import Home from "./Pages/Home";
import ChatPage from "./Pages/ChatPage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
