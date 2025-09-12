import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import { IoPerson } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";

import { API_ROUTES } from "chattrance-shared";

import { useAuth } from "../Authentication/AuthProvider";
import ChatRoom from "./ChatRoom";
import NavBar from "../Components/NavBar";

const URL = `${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}`;

const socket = io(URL, {
  withCredentials: true,
  autoConnect: false
});

/**
 * 
 * @param {Date} d 
 * @returns {string}
 */
function fmtTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Chat() {

  /**
   * rooms: {
   *   id: Number,
   *   name: string | null,
   *   owner: Number,
   *   created: Date,
   *   members: Array<Number> does not include owner
   * }
   */
  const { authUser } = useAuth();

  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState("");
  const [currentRoomId, setCurrentRoomId] = useState(null);


  const listRef = useRef(null);

  useEffect(() => {

    const fetchRooms = async () => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;

      const rooms = await getRooms();

      setChatRooms(rooms);
    }
    fetchRooms();
  }, []);

  async function getRooms() {
    try {
      const res = await fetch(API_ROUTES.CHAT.GET_ROOMS, {
        withCredentials: true
      })
      const serverJSON = await res.json();
      console.log(serverJSON);
      if (serverJSON.ok) {
        return serverJSON.data.rooms;
      } else {
        setError(serverJSON.error);
        return [];
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  const handleRoomClick = (roomId) => {
    setCurrentRoomId(roomId);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    console.log("I");
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      {/* Header and Navigation Bar */}
      <NavBar />

      {/* Lists all chat rooms you are active in */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex md:w-64 flex-col border-r border-white/10">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-lg font-semibold">Chat Rooms</h2>
            <div className="flex items-center">
              <b className="mr-2">Create a room</b>
              <button
                key="joinRoom"
                onClick={handleCreateRoom}
              >
                <CiCirclePlus size={24} />
              </button>
            </div>
          </div>
          <ul className="flex-1 overflow-auto">
            {chatRooms.length === 0 ? (
              <li className="px-4 py-3 text-white/60">No chat rooms yet</li>
            ) : (
              chatRooms.map((room) => (
                <button key={room.id}
                  onClick={() => { handleRoomClick(room.id) }}
                  className="px-4 py-3 hover:bg-white/30 focus:bg-gray-900 w-full focus:outline-none focus:border-2 focus:border-blue-500">
                  <div className="flex items-center justify-center gap-3">
                    {room.name ? (
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{room.members.length + 1}</span><IoPerson size={24} />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{room.members.length + 1}</span><IoPerson size={24} />
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </ul>
        </aside>

        {currentRoomId ? (
          <ChatRoom roomId={currentRoomId} />
        ) : (
          <section className="flex items-center justify-center flex-1">
            <div className="text-center text-white/60">Select a room to chat in</div>
          </section>
        )}

      </div>
    </div>
  );
}

export default Chat;
