import { useState } from "react";
import data from "../data/sampleData.json";
import Message from "./Message";
import FeedbackModal from "./FeedbackModal";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "you", text: input };
    const lower = input.toLowerCase();
    const aiResponse =
      data.responses[lower] || "Sorry, Did not understand your query!";

    const aiMsg = { sender: "ai", text: aiResponse };
    setMessages([...messages, userMsg, aiMsg]);
    setInput("");
  };

  const handleSave = () => {
    localStorage.setItem("chat_" + Date.now(), JSON.stringify(messages));
    setShowFeedback(true);
  };

  return (
    <div className="chat-container" style={{background: "#D7C7F4"}}>
      <header className="chat-header">Bot AI</header>

      <div className="chat-body">
        {messages.length === 0 ? (
          <div className="default-view">
            <h2>How Can I Help You Today</h2>
            <div className="card-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card">
                  <h4>Hi what is the weather</h4>
                  <p>Get immediate AI generated response</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => <Message key={i} msg={msg} />)
        )}
      </div>

      <form className="chat-input" onSubmit={handleAsk}>
        <input
          placeholder="Message Bot AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Ask</button>
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </form>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </div>
  );
}
