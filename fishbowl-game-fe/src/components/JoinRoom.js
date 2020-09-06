import React, { Component } from 'react';
import socket from '../apis/port';
import { onBlur, onFocus } from '../shared/utils';
import GameInput from "./GameInput";

export default class JoinRoom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roomCode: "",
            numberOfLocalPlayers: 1,
            invalidRoomCode: false,
            displayCodeError: false,
        };   
    }

    componentDidMount() {
        socket.on("invalid-room-code", () => {
            this.setState({
                invalidRoomCode: true
            });
        });
    }

    updateRoomCodeState = (e) => {
        if(e.target.value.length > 0) {
            this.setState({ 
                roomCode: e.target.value,
                displayCodeError: false 
            });
        }
    }
    changeValue = (inputId, inputValue) => {
        this.setState({
            numberOfLocalPlayers: inputValue
        });
    }

    joinRoom = (e) => {
        // TODO form validation
        if(this.state.roomCode !== "") {
            socket.emit("join-room", this.state.roomCode, this.state.numberOfLocalPlayers);
        } else {
            if(this.state.roomCode === "") {
                this.setState({ displayCodeError: true});
            }
            e.preventDefault();
        }
    }
    
    render() {
        return(
            <div className="join-room-modal">
                <div className="form-inputs">
                    <input id="roomCode" 
                        placeholder="room code" 
                        onChange={this.updateRoomCodeState} 
                        autocomplete="off" 
                        onFocus={onFocus}
                        onBlur={(e) => onBlur(e, "room code")}
                    />
                    {this.state.invalidRoomCode && <div className='input-error'>that code is invalid</div>}
                    {this.state.displayCodeError && <div className='input-error'>please enter a room code</div>}
                    <GameInput
                        inputId="numberOfLocalPlayers"
                        inputLabel="# of local players"
                        inputValue={this.state.numberOfLocalPlayers}
                        lowerLimit={1}
                        upperLimit={10}
                        changeAmount={1}
                        changeValue={this.changeValue}
                    />
                </div>

                <button className="fb-game-btn" onClick={this.joinRoom}>Join Room</button>
            </div>
        )
    }
};