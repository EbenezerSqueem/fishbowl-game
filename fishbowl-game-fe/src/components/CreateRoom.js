import React, { Component } from 'react';
import socket from '../apis/port';
import GameInput from './GameInput';

export default class CreateRoom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayError: false,
            roomForm: { 
                numberOfPlayers: 4,
                numberOfLocalPlayers: 1,
                wordsPerPlayer: 3,
                timePerTurn: 60,
                numberOfRounds: 3,
            }
        };   
    }

    createRoom = (e) => {
        socket.emit("create-room", this.state.roomForm);
    }
    changeValue = (inputId, inputValue) => {
        let form = this.state.roomForm;
        form[inputId] = inputValue;
        this.setState({
            roomForm: form
        });
    }

    render() {
        return(
            <div className="create-room-modal">
                <div className="form-inputs">
                    <GameInput
                        inputId="numberOfPlayers"
                        inputLabel="# of players"
                        inputValue={this.state.roomForm.numberOfPlayers}
                        lowerLimit={4}
                        upperLimit={10}
                        changeAmount={1}
                        changeValue={this.changeValue}
                    />
                    <GameInput
                        inputId="numberOfLocalPlayers"
                        inputLabel="# of local players"
                        inputValue={this.state.roomForm.numberOfLocalPlayers}
                        lowerLimit={1}
                        upperLimit={this.state.roomForm.numberOfPlayers}
                        changeAmount={1}
                        changeValue={this.changeValue}

                    />
                    <GameInput
                        inputId="wordsPerPlayer"
                        inputLabel="# of words per player"
                        inputValue={this.state.roomForm.wordsPerPlayer}
                        lowerLimit={1}
                        upperLimit={10}
                        changeAmount={1}
                        changeValue={this.changeValue}
                    />
                    <GameInput
                        inputId="numberOfRounds"
                        inputLabel="# of rounds"
                        inputValue={this.state.roomForm.numberOfRounds}
                        lowerLimit={1}
                        upperLimit={10}
                        changeAmount={1}
                        changeValue={this.changeValue}
                    />
                    <GameInput
                        inputId="timePerTurn"
                        inputLabel="seconds per turn"
                        inputValue={this.state.roomForm.timePerTurn}
                        lowerLimit={10}
                        upperLimit={120}
                        changeAmount={5}
                        changeValue={this.changeValue}
                    />
                </div>
                <button className="fb-game-btn" onClick={this.createRoom}>Create Room</button>
            </div>
        )
    }
};