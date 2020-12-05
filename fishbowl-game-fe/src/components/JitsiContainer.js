import React, { useState } from "react";
import Jitsi from "react-jitsi";

const JitsiContainer = ({ gameRoom, localUsers }) => {
  const [onCall, setOnCall] = useState(false);

  const handleAPI = (JitsiMeetAPI) => {
    JitsiMeetAPI.executeCommand("toggleVideo");
  };

  return (
    <>
      {!onCall ? (
        <button className="fb-game-btn" onClick={() => setOnCall(true)}>
          Join Video
        </button>
      ) : (
        <>
          <Jitsi
            roomName={gameRoom.jitsiRoom}
            displayName={localUsers[0]}
            password={gameRoom.roomCode}
            containerStyle={{
              paddingTop: 25,
            }}
            domain="meet.jit.si"
            onAPILoad={handleAPI}
            interfaceConfig={interfaceConfig}
            config={config}
          />
          <button className="fb-game-btn" onClick={() => setOnCall(false)}>
            Leave Video
          </button>
        </>
      )}
    </>
  );
};

const interfaceConfig = {
  LANG_DETECTION: false,
  lang: "es",
  APP_NAME: "FB",
  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
  HIDE_INVITE_MORE_HEADER: true,
  MOBILE_APP_PROMO: false,
  SHOW_CHROME_EXTENSION_BANNER: false,
  TOOLBAR_BUTTONS: [
    "microphone",
    "camera",
    "fodeviceselection",
    // 'security'
  ],
};

// TOOLBAR_BUTTONS: [
//     "microphone",
//     "camera",
//     "fullscreen",
//     "fodeviceselection",
//     "hangup",
//     "profile",
//     "chat",
//     "settings",
//     "videoquality",
//     "tileview",
//     "download",
//     "help",
//     "mute-everyone",
//     // 'security'
//   ],

const config = {
  defaultLanguage: "es",
  prejoinPageEnabled: false,
};

export default JitsiContainer;
