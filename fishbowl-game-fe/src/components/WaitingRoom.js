import React from 'react';
import OwnerControls from './OwnerControls';

const WaitingRoom = ({ gameRoom, roomCode, username, isGameOwner }) => {
    let joinedPlayers = [];
    for(const [key, value] of Object.entries(gameRoom.players)) {
        
        joinedPlayers.push(
            <li className="player-list-item">
                <div className="pl-username">- {key}</div>
                <div className="pl-team-name">{value.team}</div>
            </li>
        );
    };
    return(
        <div className="waiting-room-container">
            <div className="waiting-room-greeting">Hi {username}! You are in the waiting room. Room key: {roomCode}</div>
            <div className="player-container">
                <div className="player-list-label">Players Joined</div>
                <ul className="player-list">
                    {joinedPlayers}
                </ul>
            </div>
            
            {isGameOwner 
                && <OwnerControls 
                    gameRoom={gameRoom} 
                    roomCode={roomCode} 
                />
            }
        </div>
    )
};

export default WaitingRoom;