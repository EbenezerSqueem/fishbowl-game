import React from 'react';

const TurnControls = ({ gameAction, correctAnswer, roomCode, currentWord, hasTurnStarted }) => (
    <div className="turn-container">
        <div className="turn-label">IT'S YOUR TURN!</div>
        {
            hasTurnStarted
            && <div className="current-word-container">
                    <p className="current-word-label">CURRENT WORD</p>
                    <p className="current-word">{currentWord}</p>
                </div>
        }
        <div className="turn-controls">
            {
                hasTurnStarted 
                && <button className="fb-game-btn lighter-btn" onClick={()=>correctAnswer(roomCode)}>GOT IT!</button>
            }
            {
                hasTurnStarted
                && <button className="fb-game-btn lighter-btn" onClick={()=>gameAction("toggle-pause", roomCode)}>Pause Game</button>
            }
            {
                !hasTurnStarted
                && <button className="fb-game-btn lighter-btn" onClick={()=>gameAction("start-turn", roomCode)}>Start Turn</button>
            }
        </div>
    </div>
);

export default TurnControls;