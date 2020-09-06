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
            localUsers: [],
            numberOfLocalPlayers: 1,
            roomCode: "",
            enteredWords: false,
            gameRoom: {}
        }
    }

    componentDidMount = () => {
        socket.on("room-created", (gameRoomDetails, numLocal) => {
            
            this.setState({
                inGameRoom: true,
                isGameOwner: true,
                roomCode: gameRoomDetails.roomCode,
                gameRoom: gameRoomDetails,
                numberOfLocalPlayers: numLocal,
                isGameRestart: false
            });
        })

        socket.on("user-joined-room", data => {

            if(!this.state.inGameRoom) {
                // update state for new user
                this.setState({ 
                    inGameRoom: true,
                    roomCode: data.roomCode,
                    gameRoom: data.roomDetails,
                    numberOfLocalPlayers: data.numberOfLocalPlayers
                });
            } else {
                // update game state for all users already joined
                this.setState({
                    gameRoom: data.roomDetails
                });
            }
        });

        socket.on("word-form-submitted", ({gameRoom, newUser}) => {
            if(!this.state.enteredWords) {
                // determine if all local users entered submitted their words
                let usersArr = this.state.localUsers;
                usersArr.push(newUser);
                
                if(usersArr.length === this.state.numberOfLocalPlayers) {
                    this.setState({ 
                        gameRoom,
                        localUsers: usersArr,
                        enteredWords: true
                    });
                } else {
                    // more users need to submit their words
                    this.setState({ 
                        gameRoom,
                        localUsers: usersArr
                    });
                }
            } else {
                // just update the game state with new online users
                this.setState({
                    gameRoom
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
                isGameRestart: true

            });
        });
    }

    // submittedWords = () => {
    //     this.setState({ enteredWords: true });
    // }

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
                            numberOfWords={this.state.gameRoom.gameSettings.wordsPerPlayer}
                            numberOfLocalPlayers={this.state.numberOfLocalPlayers}
                            numberOfUsersSubmitted={this.state.localUsers.length}
                            isGameRestart={this.state.isGameRestart}
                            gameRoom={this.state.gameRoom}
                        />
                }

                {
                    this.state.inGameRoom 
                    && this.state.enteredWords 
                    && !this.state.gameRoom.isGameStarted
                    && <WaitingRoom
                        isGameOwner={this.state.isGameOwner}
                        roomCode={this.state.roomCode}
                        gameRoom={this.state.gameRoom}
                        />
                }

                {
                    this.state.gameRoom.isGameStarted
                    && !this.state.isGameOver
                    && <GameRoom 
                        localUsers={this.state.localUsers} 
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