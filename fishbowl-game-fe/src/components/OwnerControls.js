import React from 'react';
import TeamSettings from './TeamSettings';
import socket from '../apis/port';

export default function OwnerControls(props) {
    
    const startGame = () => {
        socket.emit("start-game", props.roomCode);
    };

    // future TODO allow admin to adjust the game settings from this page

    return (
        <div className='game-controls'>
            <div className='game-controls-title'>Game Controls</div>
            <TeamSettings gameRoom={props.gameRoom} />
            <button className="fb-game-btn lighter-btn" onClick={startGame}>Start Game</button>    
        </div>
    )
}