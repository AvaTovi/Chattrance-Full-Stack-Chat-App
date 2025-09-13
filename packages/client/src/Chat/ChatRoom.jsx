import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

import { API_ROUTES, CONSTANTS } from "chattrance-shared";

import { useAuth } from "../Authentication/AuthProvider";

const MESSAGE_SIZE = 500;

function fmtTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ChatRoom({ roomId }) {

  const { authUser } = useAuth();
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const listRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesFromRoom = await getMessage();
      if (messagesFromRoom.length === [].length) {
        return;
      }
      setMessages([...messagesFromRoom]);
    };
    fetchMessages();
  })

  const getMessage = async () => {

    try {
      const res = await fetch(`${API_ROUTES.MESSAGES.GET_MESSAGES}?room-id=${roomId}`, {
        credentials: "include"
      });
      const serverJSON = await res.json();

      if (serverJSON.ok) {
        console.log(serverJSON)
        return serverJSON.data.messages
      } else {
        setError(serverJSON.error);
        return [];
      }

    } catch (err) {
      console.error("Get message error:", err);
      return [];
    }
  }

  const sendMessage = async (content) => {
    try {
      const res = await fetch(`${API_ROUTES.MESSAGES.SEND_MESSAGE}?room-id=${roomId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content })
      });
      return await res.json();
    } catch (err) {
      console.error("Send message error:", err);
    }

  }

  const handleMessage = (e) => {
    setInput(e.target.value);
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
    setMessages([...messages, { id: 0, from: "some guy", at: new Date(), text }]);
  };

  return (
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

      <div className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={handleMessage}
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
        <div className="flex items-center text-xs text-white/50 mt-1">
          Press <kbd className="px-1 py-0.5 bg-white/10 rounded">Enter</kbd> to send •{" "}
          <kbd className="px-1 py-0.5 bg-white/10 rounded">Shift</kbd>+<kbd className="px-1 py-0.5 bg-white/10 rounded">Enter</kbd> for newline
        </div>
      </div>
    </section>
  );

}

export default ChatRoom;