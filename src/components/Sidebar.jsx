import { Link } from "react-router-dom";
import { FaEdit, FaTimes } from "react-icons/fa";
import chatIcon from "../assets/chatIcon.svg";
import { clearCurrentConversation } from "../services/chatService";

export default function Sidebar({ isOpen, toggleSidebar }) {

  const handleNewChat = () => {
    clearCurrentConversation();
    window.location.reload();
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Close button on mobile */}
      <div className="close-btn" onClick={toggleSidebar}>
        <FaTimes />
      </div>

      <div className="sidebar-header">
        <img src={chatIcon} alt="Bot AI Logo" className="logo" />
        <span>New Chat</span>
        <Link to="/" onClick={handleNewChat}>
          <FaEdit className="edit-icon" />
        </Link>
      </div>

      <div className="sidebar-body">
        <Link to="/history">
          <button className="history-btn">Past Conversations</button>
        </Link>
      </div>
    </div>
  );
}
