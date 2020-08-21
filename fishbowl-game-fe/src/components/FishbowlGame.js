import React, { Component } from 'react';
import Header from './Header';
import TitleScreen from './TitleScreen';
import WordForm from './WordsForm';
import WaitingRoom from './WaitingRoom';
import GameRoom from './GameRoom';
import EndGameSummary from './EndGameSummary';
import socket from '../apis/port';

export default class FishbowlGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inGameRoom: false,
            isGameOwner: false,
            isGameOver: false,
            username: "",
            roomCode: "",
            enteredWords: false,

            gameRoom: {}
        }
    }

    componentDidMount = () => {
        socket.on("room-created", gameRoomDetails => {
            
            this.setState({
                username: gameRoomDetails.roomOwner,
                inGameRoom: true,
                isGameOwner: true,
                roomCode: gameRoomDetails.roomCode,
                gameRoom: gameRoomDetails
            });
        })

        socket.on("user-joined-room", data => {

            if(this.state.username === "") {
                // update state for new user
                this.setState({ 
                    username: data.username,
                    inGameRoom: true,
                    roomCode: data.roomCode,
                    gameRoom: data.roomDetails
                });
            } else {
                // update game state for all users already joined
                this.setState({
                    gameRoom: data.roomDetails
                });
            }
        });

        socket.on("update-game-state", gameRoom => {
            this.setState({ gameRoom: gameRoom });
        });
        
        socket.on("end-of-game", gameRoom => {
            // console.log("GAME OVER");
            this.setState({ gameRoom: gameRoom, isGameOver: true });
        });

        socket.on("game-reset", gameRoom => {
            // reset state settings
            this.setState({
                gameRoom: gameRoom,
                isGameOver: false,
                enteredWords: false,

            });
        });
    }

    submittedWords = () => {
        this.setState({ enteredWords: true });
    }

    updateGameState = gameRoom => {
        this.setState({ gameRoom: gameRoom });
    }

    render() {
        return (
            <div className='game-container'>
                {
                    !this.state.inGameRoom 
                    && <TitleScreen />
                }

                {
                    this.state.inGameRoom
                    && <Header />
                }

                {
                    this.state.inGameRoom 
                    && !this.state.enteredWords 
                    && <WordForm 
                            roomCode={this.state.roomCode}
                            username={this.state.username}
                            numberOfWords={this.state.gameRoom.gameSettings.wordsPerPlayer}
                            submittedWords={this.submittedWords}
                        />
                }

                {
                    this.state.inGameRoom 
                    && this.state.enteredWords 
                    && !this.state.gameRoom.isGameStarted
                    && <WaitingRoom
                        isGameOwner={this.state.isGameOwner}
                        roomCode={this.state.roomCode}
                        username={this.state.username}
                        gameRoom={this.state.gameRoom}
                        />
                }

                {
                    this.state.gameRoom.isGameStarted
                    && !this.state.isGameOver
                    && <GameRoom 
                        username={this.state.username} 
                        gameRoom={this.state.gameRoom}
                        isGameOwner={this.state.isGameOwner} 
                        updateGameState={this.updateGameState} 
                    />
                }

                {
                    this.state.isGameOver 
                    && <EndGameSummary 
                        gameRoom={this.state.gameRoom} 
                        isGameOwner={this.state.isGameOwner}
                        />
                }
            </div>
        )
    }
};  