import React, { Component } from 'react';
import socket from '../apis/port';
import GameInput from './GameInput';
import { onBlur, onFocus } from '../shared/utils';

export default class CreateRoom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayError: false,
            roomForm: { 
                username: "",
                numberOfPlayers: 4,
                wordsPerPlayer: 3,
                timePerTurn: 60,
                numberOfRounds: 3,
            }
        };   
    }

    updateFormState = (e) => {
        let form = this.state.roomForm;
        form[e.target.id] = e.target.value;
        if(e.target.id === "username" && e.target.value.length > 0) {
            this.setState({ displayError: false });
        }
        this.setState({
            roomForm: form
        });
    }

    createRoom = (e) => {
        // TODO form validation
        if(this.state.roomForm.username !== "") {
            socket.emit("create-room", this.state.roomForm);
        } else {
            // TODO form validation
            this.setState({ displayError: true});
            e.preventDefault();
        }
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
                    <input id="username" 
                        placeholder="username" 
                        onChange={this.updateFormState} 
                        autocomplete="off"
                        onBlur={(e) => onBlur(e, "username")}
                        onFocus={onFocus}
                    />
                    {this.state.displayError && <div className="input-error">please enter a username</div>}
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