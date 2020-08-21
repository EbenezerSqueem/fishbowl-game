import React from 'react';
import Scoreboard from './Scoreboard';
import socket from '../apis/port';

const EndGameSummary = ({ gameRoom, isGameOwner }) => {
    let winnerText = "";
    let teamOneScore = gameRoom.score.teamOne;
    let teamTwoScore = gameRoom.score.teamTwo;
    if(teamOneScore > teamTwoScore) {
        winnerText = "TEAM ONE WINS!!";
    } else if(teamTwoScore > teamOneScore) {
        winnerText = "TEAM TWO WINS!!";
    } else {
        winnerText = "IT'S A TIE! PLAY AGAIN!";
    }

    const resetGame = () => {
        socket.emit("reset-game", gameRoom.roomCode);
    }

    return (
        <div className="game-summary-container">
            <div className="game-summary-notifications">
                <div className="game-summary-header">Game Summary</div>
                <div className="winner-section">{winnerText}</div>
            </div>
            <Scoreboard scores={gameRoom.score} players={gameRoom.players} />
            {
                isGameOwner
                && <button className="fb-game-btn" onClick={resetGame}>Restart Game</button>
            }
        </div>
    )
}

export default EndGameSummary;