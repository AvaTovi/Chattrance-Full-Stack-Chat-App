import { useEffect, useRef, useState } from "react";

import { useAuth } from "../Authentication/AuthProvider";

import socket from '../socket';

const MESSAGE_SIZE = 500;

function fmtTime(created) {
  const d = new Date(created);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ChatRoom({ roomId }) {

  const { authUser } = useAuth();

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([]);

  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollContainRef = useRef(null);

  useEffect(() => {

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join-room', roomId);

    socket.on('load-initial-messages', (prevMsgs) => {
      setMessages(prevMsgs);
    });

    socket.on('receive-message', (msg) => {
      setMessages((prevMsgs) => [...prevMsgs, msg]);
    });

    socket.on('load-more-messages', (olderMsgs) => {
      setMessages((currMsgs) => [...olderMsgs, ...currMsgs]);
    });

    scrollToBottom();

    return () => {
      socket.emit('leave-room', roomId);
      socket.off('receive-message');
    };
  }, []);

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    const scrollElement = scrollContainRef.current;

    if (scrollElement) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  };

  const isAtBottom = () => {
    const scrollElement = scrollContainRef.current;
    if (!scrollElement) return false;
    const threshold = 100;
    return (
      scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < threshold
    );
  };

  const handleScroll = () => {
    setShouldAutoScroll(isAtBottom());
  };

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
    socket.emit('send-message', { roomId, content: text });
    setInput("");
  };

  return (
    <section className="flex flex-1 flex-col">
      {messages.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center flex-col text-white/60">
          <p>No messages yet</p>
        </div>
      ) : (
        <ul
          ref={scrollContainRef}
          onScroll={handleScroll}
          className="flex justify-start flex-col h-full p-4 space-y-3 overflow-y-auto">
          {/* Messages */}
          {messages.map(m => {
            if (m.userId === authUser.id)
              return (
                <li key={m.id} className="ml-auto px-4 py-2">
                  <div
                    style={{ width: "fit-content" }}
                    className="ml-auto mr-2 mb-1 text-sm opacity-80">
                    You • {fmtTime(m.created)}
                  </div>
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      width: "fit-content"
                    }}
                    className="ml-auto rounded-2xl p-2 text-black">
                    <p
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word"
                      }}>
                      {m.content}
                    </p>
                  </div>
                </li>
              );
            return (
              <li key={m.id} className="w-1/2 px-4 py-2">
                <div className="ml-2 mb-1 text-sm opacity-80">
                  {m.username} • {fmtTime(m.created)}
                </div>
                <div
                  style={{
                    backgroundColor: "rgba(0, 120, 255, 0.8)"
                  }}
                  className="inline-block rounded-2xl p-2.5">
                  <p
                    style={{
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word"
                    }}>
                    {m.content}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>


      )}

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