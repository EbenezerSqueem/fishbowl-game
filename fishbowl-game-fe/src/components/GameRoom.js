import React, { Component } from 'react';
import TurnControls from './TurnControls';
import Timer from './Timer';
import GameDashboard from './GameDashboard';
import socket from '../apis/port';
import Scoreboard from './Scoreboard';

export default class GameRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secondsRemaining: this.props.gameRoom.gameSettings.timePerTurn,
            isMyTurn: false,
            hasTurnStarted: false,
            didRoundEnd: false,
        }
        this.intervalHandle = null;
        this.startTimer = this.startTimer.bind(this);
        this.tick = this.tick.bind(this);
    }

    componentDidMount = () => {
        if(this.props.gameRoom.currentTurnPlayer === this.props.username) {
            this.setState({ isMyTurn: true });
        }
        socket.on("turn-started", gameRoom => {
            this.props.updateGameState(gameRoom);
            this.setState({ hasTurnStarted: true });
            this.startTimer(); 
        });

        socket.on("toggle-pause", gameRoom => {
            this.props.updateGameState(gameRoom);
            if(this.props.gameRoom.isGamePaused) {
                this.pauseTimer();
            } else {
                this.resumeTimer();
            }
        });

        socket.on("correct", data => {
            // update game state in props
            this.props.updateGameState(data.gameRoom);
            // do something to signify correct answer
            if(data.didRoundEnd) {
                // pause timer until user is ready to start new round
                this.setState({ didRoundEnd: data.didRoundEnd });
                clearInterval(this.intervalHandle);
            }
        });

        socket.on("next-turn", gameRoom => {
            // update game state in props
            this.props.updateGameState(gameRoom);
            // update state
            if(this.props.gameRoom.currentTurnPlayer === this.props.username) {
                this.setState({ isMyTurn: true });
            }
        });

    }

    tick = () => {
        let timeRemaining = this.state.secondsRemaining;
        if(timeRemaining === 0) {
            clearInterval(this.intervalHandle);
            this.setState({ hasTurnStarted: false });
            if(this.state.isMyTurn) {
                this.setState({ isMyTurn: false });
                this.gameAction("end-turn", this.props.gameRoom.roomCode);
            }
        } else {
            timeRemaining--;
            this.setState({ secondsRemaining: timeRemaining });
        }
    };

    gameAction = (action, args) => {
        socket.emit(action, args);
    }

    correctAnswer = (roomCode) => {
        let username = this.props.username;
        socket.emit("correct-answer", roomCode, username, this.props.gameRoom.players[username].team);
    }

    startTimer = () => {
        this.setState({ secondsRemaining: this.props.gameRoom.gameSettings.timePerTurn });
        this.intervalHandle = setInterval(this.tick, 1000);
    }

    pauseTimer = () => {
        clearInterval(this.intervalHandle);
    }

    resumeTimer = () => {
        this.intervalHandle = setInterval(this.tick, 1000);
    }

    render() {
        return(
            <div className="game-room-container">                
                <div className="game-room-sub-container">
                    <div className="game-details-header">Game Details</div>
                    <GameDashboard gameRoom={this.props.gameRoom} />

                    <Timer secondsRemaining={this.state.secondsRemaining} />

                    {this.props.gameRoom.isGamePaused && <div className="pause-label">GAME PAUSED</div>}

                    {
                        this.props.gameRoom.isGamePaused 
                        && (this.props.isGameOwner || this.state.isMyTurn)
                        && <div className="pause-btn-container">
                                <button className="fb-game-btn lighter-btn"  onClick={()=>this.gameAction("toggle-pause", this.props.gameRoom.roomCode)}>
                                    Resume Game
                                </button>
                            </div>
                    }
                    {
                        this.state.isMyTurn 
                        && !this.props.gameRoom.isGamePaused
                        && <TurnControls 
                            gameAction={this.gameAction} 
                            correctAnswer={this.correctAnswer}
                            roomCode={this.props.gameRoom.roomCode} 
                            currentWord={this.props.gameRoom.currentWord}
                            hasTurnStarted={this.state.hasTurnStarted}
                            />
                    }
                </div>
                
                <Scoreboard scores={this.props.gameRoom.score} players={this.props.gameRoom.players} />
            </div>
        )
    }
};