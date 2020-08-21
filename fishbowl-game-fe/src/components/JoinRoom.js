import React, { Component } from 'react';
import socket from '../apis/port';
import { onBlur, onFocus } from '../shared/utils';

export default class JoinRoom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roomForm: { 
                username: "",
                roomCode: "",
            },
            invalidRoomCode: false,
            invalidUsername: false,
            displayUsernameError: false,
            displayCodeError: false,
        };   
    }

    componentDidMount() {
        socket.on("invalid-room-code", () => {
            this.setState({
                invalidRoomCode: true
            });
        });
        socket.on("user-already-exists", () => {
            this.setState({
                invalidUsername: true
            });
        })
    }

    updateFormState = (e) => {
        let form = this.state.roomForm;
        form[e.target.id] = e.target.value;
        if(e.target.id === "username" && e.target.value.length > 0) {
            this.setState({ displayUsernameError: false });
        }
        if(e.target.id === "roomCode" && e.target.value.length > 0) {
            this.setState({ displayCodeError: false });
        }
        this.setState({
            roomForm: form
        });
    }

    joinRoom = (e) => {
        // TODO form validation
        if(this.state.roomForm.username !== "" && this.state.roomForm.roomCode !== "") {
            socket.emit("join-room", this.state.roomForm.username, this.state.roomForm.roomCode);
        } else {
            // TODO form validation
            if(this.state.roomForm.username === "") {
                this.setState({ displayUsernameError: true});
            }
            if(this.state.roomForm.roomCode === "") {
                this.setState({ displayCodeError: true});
            }
            e.preventDefault();
        }
    }
    
    render() {
        return(
            <div className="join-room-modal">
                <div className="form-inputs">
                    <input id="username" 
                        placeholder="username" 
                        onChange={this.updateFormState} 
                        autocomplete="off" 
                        onFocus={onFocus}
                        onBlur={(e) => onBlur(e, "username")}
                    />
                    {this.state.displayUsernameError && <div className='input-error'>please enter a username</div>}
                    {this.state.invalidUsername && <div className='input-error'>that username is already taken</div>}
                    <input id="roomCode" 
                        placeholder="room code" 
                        onChange={this.updateFormState} 
                        autocomplete="off" 
                        onFocus={onFocus}
                        onBlur={(e) => onBlur(e, "room code")}
                    />
                    {this.state.invalidRoomCode && <div className='input-error'>that code is invalid</div>}
                    {this.state.displayCodeError && <div className='input-error'>please enter a room code</div>}
                </div>

                <button className="fb-game-btn" onClick={this.joinRoom}>Join Room</button>
            </div>
        )
    }
};