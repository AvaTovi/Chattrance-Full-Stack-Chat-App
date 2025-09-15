import { useEffect, useState } from "react";
import io from "socket.io-client";

import { IoPerson } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { TbArrowsJoin } from "react-icons/tb";

import { API_ROUTES } from "chattrance-shared";

import ChatHeader from "./ChatHeader";
import ChatRoom from "./ChatRoom";

import NavBar from "../Components/NavBar";
import JoinRoomPopUp from "../Components/PopUps/JoinRoom";
import CreateRoomPopUp from "../Components/PopUps/CreateRoom";

const URL = `${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}`;

const socket = io(URL, {
  withCredentials: true,
  autoConnect: false
});

function Chat() {

  const [chatRooms, setChatRooms] = useState([]);

  const [createButton, setCreateButton] = useState(false);

  const [currentRoomIndex, setCurrentRoomId] = useState(null);

  const [joinButton, setJoinButton] = useState(false);

  useEffect(() => {

    const fetchRooms = async () => {
      const rooms = await getRooms();
      setChatRooms(rooms);
    }
    fetchRooms();

  }, []);

  const messageBoxes = chatRooms.map(room => { return <ChatRoom key={room.id} roomId={room.id} /> });

  async function getRooms() {
    try {
      const res = await fetch(API_ROUTES.CHAT.GET_ROOMS, {
        credentials: "include"
      });
      const serverJSON = await res.json();
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

  const handleRoomClick = (index) => {
    if (index !== currentRoomIndex) {
      setCurrentRoomId(index);
    }
  };

  const openCreatePopUp = async () => {
    setCreateButton(!createButton);
  };

  const closeCreatePopUp = async () => {
    setCreateButton(false);
  }

  const openJoinPopUp = async () => {
    setJoinButton(!joinButton);
  }

  const closeJoinPopUp = async () => {
    setJoinButton(false);
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      {/* Header and Navigation Bar */}
      <NavBar />

      {/* Lists all chat rooms you are active in */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex md:w-64 flex-col border-r border-white/10">
          <div className="flex flex-col gap-2 px-4 py-3 border-b border-white/10">
            <h2 className="text-center text-lg font-semibold">Chat Rooms</h2>

            <div className="flex justify-center items-center">
              <p className="mr-2">Create a room</p>
              <button onClick={openCreatePopUp}>
                <CiCirclePlus size={30} color="skyblue" />
              </button>
              {createButton && <CreateRoomPopUp onClose={closeCreatePopUp} />}
            </div>

            <div className="flex justify-center items-center">
              <p className="mr-2">Join a room</p>
              <button onClick={openJoinPopUp}>
                <TbArrowsJoin size={30} color="skyblue" />
              </button>
              {joinButton && <JoinRoomPopUp onClose={closeJoinPopUp} />}
            </div>

          </div>
          <ul className="flex-1 overflow-auto">
            {chatRooms.length === 0 ? (
              <li className="text-center px-4 py-3 text-white/60">No chat rooms yet</li>
            ) : (
              chatRooms.map((room, index) => (
                <button
                  key={room.id}
                  onClick={() => { handleRoomClick(index) }}
                  className="px-4 py-3 hover:bg-gray-500 focus:bg-gray-800 w-full focus:outline-none focus:border-2 focus:border-blue-500">

                  <div className="flex flex-col items-center justify-center gap-3">

                    {room.name ? (
                      <span>{room.name}</span>
                    ) : null}

                    <span>{room.id}</span>

                    <div className="flex items-center justify-center">
                      <span className="text-xl mr-2">
                        {room.members.length + 1}
                      </span>
                      <IoPerson size={24} />
                    </div>

                  </div>
                </button>
              ))
            )}
          </ul>
        </aside>

        {currentRoomIndex !== null ? (
          messageBoxes[currentRoomIndex]
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
