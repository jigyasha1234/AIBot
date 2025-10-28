export default function PastConversations() {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("chat_"));
  const conversations = keys.map((k) => JSON.parse(localStorage.getItem(k)));

  return (
    <div className="history-container">
      <h2>Conversation History</h2>
      {conversations.length === 0 ? (
        <p>No past conversations.</p>
      ) : (
        conversations.map((conv, i) => (
          <div key={i} className="conversation">
            {conv.map((m, j) => (
              <p key={j}>
                <strong>{m.sender === "ai" ? "Soul AI:" : "You:"}</strong>{" "}
                {m.text}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
