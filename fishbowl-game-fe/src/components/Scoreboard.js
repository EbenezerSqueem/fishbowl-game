import React from 'react';

const Scoreboard = ({ scores, players }) => {
    let teamOne = [];
    let teamTwo = [];

    if(players !== undefined && Object.keys(players).length > 0) {
        for(const [key, value] of Object.entries(players)) {
            let playerEl = (
                <li className="player-score-item">
                    <div className="player-score">{key} : {value.score}</div>
                </li>
            );
            if(value.team === "teamOne") {
                teamOne.push(playerEl);
            } else {
                teamTwo.push(playerEl);
            }
        };
    }

    return(
        <div className="scoreboard-container">
            <div className="scoreboard-title">Game Score</div>
            <div className="team-one-scores">
                <div className="team-score">Team One: {scores.teamOne}</div>
                <ul className="team-scores-list">
                    {teamOne}
                </ul>
            </div>
            <div className="team-two-scores">
                <div className="team-score">Team Two: {scores.teamTwo}</div>
                <ul className="team-scores-list">
                    {teamTwo}
                </ul>
            </div>
        </div>
    )
}

export default Scoreboard;