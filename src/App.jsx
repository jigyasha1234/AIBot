import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import PastConversations from "./components/PastConversations";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<ChatWindow />} />
          <Route path="/history" element={<PastConversations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
