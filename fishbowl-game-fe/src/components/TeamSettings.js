import React, { Component } from 'react';
import socket from '../apis/port';

export default class TeamSettings extends Component {
    constructor(props) {
        super(props);

        this.state={

        }
    }
    updateTeam = (e) => {
        // grab value and send socket message
        let username = e.target.id;
        let teamValue = e.target.value;
        socket.emit("update-team", username, this.props.gameRoom.roomCode, teamValue);
    };

    render() {
        let unassignedList = [];
        let teamOneList = [];
        let teamTwoList = [];

        for(const[key, value] of Object.entries(this.props.gameRoom.players)) {
            if(value.team === "teamOne"){ 
                teamOneList.push(<li>{key}</li>);
            } else if (value.team === "teamTwo") {
                teamTwoList.push(<li>{key}</li>);
            } else {
                unassignedList.push(
                    <li className="team-settings-li">
                        <p className="pl-username">{key}</p> 
                        <select className="team-select" onChange={this.updateTeam} id={key}>
                            <option value="" selected>Select Team</option>
                            <option value="teamOne">Team One</option>
                            <option value="teamTwo">Team Two</option>
                        </select>
                    </li>
                );
            }
        }

        return (
            <div className="team-settings-container">
                <div className="team-settings-header">Team Settings</div>
                <div className="teams-container">
                    <div className="unassigned">
                        <div className="team-label">unassigned</div>
                        <ul className="team-settings-list">
                                {unassignedList}
                        </ul>
                    </div>
                    <div className="team-label">Team One
                        <ul className="team-settings-list">
                            {teamOneList}
                        </ul>
                    </div>
                    <div className="team-label">Team Two
                        <ul className="team-settings-list">
                            {teamTwoList}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
};
