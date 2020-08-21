import React from 'react';

const GameDashboard = ({ gameRoom }) => {
    return(
        <div className="game-details-container">
            <div className="details-div">Current Round: {gameRoom.currentRound}</div>
            <div className="details-div">Current Team: {gameRoom.currentTurnTeam}</div>
            <div className="details-div">Player {gameRoom.currentTurnPlayer} is up!</div>
        </div>
    )
}

export default GameDashboard;