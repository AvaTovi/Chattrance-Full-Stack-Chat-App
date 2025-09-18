import { useEffect, useRef, useState } from "react";

import { useAuth } from "../Authentication/AuthProvider";

function ChatHeader({ roomName, roomId, roomOwner }) {

  return (
    <div className="flex flex-col items-center">
      <h2 className="">
        Name: {roomName}
      </h2>
      <h2>
        Room ID: {roomId}
      </h2>
    </div>
  )
}

export default ChatHeader;