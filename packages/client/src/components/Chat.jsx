import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import NavBar from "./NavBar";
import { useAuth } from "./AuthProvider";

const MESSAGE_SIZE = 250;

const socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: false
});

function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Chat() {
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { authUser, logout } = useAuth();
  const username = authUser.name;

  const listRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;

    socket.connect();
    socket.on("receive_message", (data) => {
      console.alert(data);
    });

  }, [messages.length, socket]);

  const handleChange = (e) => {
    setInput(e.target.value);
    setIsTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || text.length > MESSAGE_SIZE) return;
    const now = Date.now();
    socket.emit("send_message", {
      username: authUser.username,
      timestamp: now,
      message: text
    });
    setMessages((prev) => [...prev, { id: "m_" + now, from: me, text, at: now }]);
    setInput("");
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      {/* Header and Navigation Bar */}
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex md:w-64 flex-col border-r border-white/10">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-lg font-semibold">Participants</h2>
          </div>
          <ul className="flex-1 overflow-auto">
            {participants.length === 0 ? (
              <li className="px-4 py-3 text-white/60">No participants yet</li>
            ) : (
              participants.map((p) => (
                <li key={p.id} className="px-4 py-3 hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span>{p.name}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </aside>

        <section className="flex-1 flex flex-col">
          <div ref={listRef} className="flex-1 overflow-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/60">
                No messages yet
              </div>
            ) : (
              <ul className="space-y-3">
                {messages.map((m) => (
                  <li key={m.id} className="max-w-[85%]">
                    <div
                      className={`inline-block rounded-2xl px-4 py-2 ${(authUser?.username || "You") === m.from
                        ? "bg-blue-600/90 text-white"
                        : "bg-white/10 text-white"
                        }`}
                    >
                      <div className="text-xs opacity-80 mb-0.5">
                        {m.from} • {fmtTime(m.at)}
                      </div>
                      <div className="whitespace-pre-wrap break-words">{m.text}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="min-h-6 px-5 pb-1 text-sm text-white/60">{isTyping && "Typing…"}</div>

          <div className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message"
                className="flex-1 resize-none rounded-xl bg-white/5 text-white placeholder-white/40 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <button
                type="button"
                onClick={handleSend}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition text-white font-medium"
              >
                Send
              </button>
            </div>
            <div className="text-xs text-white/50 mt-1">
              Press <kbd className="px-1 py-0.5 bg-white/10 rounded">Enter</kbd> to send •{" "}
              <kbd className="px-1 py-0.5 bg-white/10 rounded">Shift</kbd>+<kbd className="px-1 py-0.5 bg-white/10 rounded">Enter</kbd> for newline
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Chat;
