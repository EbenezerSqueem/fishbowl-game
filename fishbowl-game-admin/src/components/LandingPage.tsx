import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import socket from "../apis/port";

import { IconSVG } from "./IconSVG";

export const LandingPage: React.FC<{
  setShowAdmin: Dispatch<SetStateAction<boolean>>;
  setGameRooms: Dispatch<SetStateAction<object>>;
}> = ({ setShowAdmin, setGameRooms }) => {
  const [adminCode, setAdminCode] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // correct code
    socket.on("correct-code", (gameRooms: object) => {
      setShowAdmin(true);
      setGameRooms(gameRooms);
    });
    socket.on("incorrect-code", () => {
      setShowError(true);
    });
  }, []);

  const submitAdminCode = () => {
    setShowError(false);
    // submit admin code
    if (adminCode.length === 0) {
      // show admin code error
      setShowError(true);
    } else {
      // send code to server
      socket.emit("submit-admin-code", adminCode);
    }
  };
  const handleChange = (e: any) => {
    setAdminCode(e.target.value);
  };

  return (
    <div className="title-screen-container">
      <div className="title-logo-container">
        <div className="title-logo">
          <IconSVG
            width={208}
            height={208}
            viewBoxWidth={208}
            viewBoxHeight={208}
          />
        </div>
        <div className="game-title">
          <p className="game-title-fish">FISH</p>
          <p className="game-title-bowl">BOWL</p>
        </div>
      </div>
      <div className="form-inputs">
        {showError && <div className="input-error">Invalid Admin Code</div>}
        <input
          type="text"
          id="username"
          placeholder="Admin Code"
          value={adminCode}
          onChange={handleChange}
        />
      </div>
      <button
        className="fb-game-btn"
        color="primary"
        onClick={() => submitAdminCode()}
      >
        Authenticate
      </button>
    </div>
  );
};
