import React, { useState, useEffect } from "react";

// import { socket } from "../apis/port";

import { LandingPage } from "./LandingPage";
import { Admin } from "./Admin";

export const AdminContainer: React.FC<{}> = ({}) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [gameRooms, setGameRooms] = useState({});

  return (
    <div className="game-container">
      {!showAdmin ? (
        <LandingPage setShowAdmin={setShowAdmin} setGameRooms={setGameRooms} />
      ) : (
        <Admin gameRooms={gameRooms} />
      )}
    </div>
  );
};
