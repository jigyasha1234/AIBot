import { Link } from "react-router-dom";
import { FaPlus, FaEdit } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/assets/chatIcon.svg" alt="Bot AI Logo" className="logo" />
        <span>New Chat</span>
        <FaEdit className="edit-icon" />
      </div>
      <div className="sidebar-body">
      <Link to="/history">
        <button className="history-btn">Past Conversations</button>
      </Link>
      </div>
    </div>
  );
}
