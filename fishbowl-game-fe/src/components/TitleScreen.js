import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";
import { IconSVG } from "./IconSVG";

const TitleScreen = (props) => {
  const [createRoom_modal, setCreateRoom_modal] = useState(false);
  const [joinRoom_modal, setJoinRoom_modal] = useState(false);

  const toggle_createModal = () => setCreateRoom_modal(!createRoom_modal);
  const toggle_joinModal = () => setJoinRoom_modal(!joinRoom_modal);

  return (
    <div className="title-screen-container">
      <div className="title-logo-container">
        <div className="title-logo">
          <IconSVG />
        </div>
        <div className="game-title">
          <p className="game-title-fish">FISH</p>
          <p className="game-title-bowl">BOWL</p>
        </div>
      </div>
      <button className="fb-game-btn" onClick={toggle_createModal}>
        Create Game
      </button>

      <button className="fb-game-btn" onClick={toggle_joinModal}>
        Join Game
      </button>

      <Modal
        className="modal-container"
        isOpen={createRoom_modal}
        toggle={toggle_createModal}
      >
        <ModalHeader toggle={toggle_createModal}></ModalHeader>
        <ModalBody>
          <CreateRoom />
        </ModalBody>
      </Modal>
      <Modal
        className="modal-container"
        isOpen={joinRoom_modal}
        toggle={toggle_joinModal}
      >
        <ModalHeader toggle={toggle_joinModal}></ModalHeader>
        <ModalBody>
          <JoinRoom />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default TitleScreen;
