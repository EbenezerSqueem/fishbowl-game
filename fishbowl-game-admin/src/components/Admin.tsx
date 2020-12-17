import React from "react";

import Header from "./Header";

export const Admin: React.FC<{ gameRooms: object }> = ({ gameRooms }) => {
  // loop through game rooms and display each
  let gameRoomsDisplay = [];
  if (gameRooms && Object.entries(gameRooms).length > 0) {
    for (const [key, value] of Object.entries(gameRooms)) {
      gameRoomsDisplay.push(<div>key</div>);
    }
  }
  return (
    <>
      <Header />
      <div>Admin Page</div>
      {gameRoomsDisplay}
    </>
  );
};
