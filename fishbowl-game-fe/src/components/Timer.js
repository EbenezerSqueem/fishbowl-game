import React, { Component } from 'react';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.formatTime = this.formatTime.bind(this);
    }

    formatTime = (time) => {
        if(time >= 60) {
            let minutes = Math.floor(time / 60);
            let seconds = time - (minutes * 60);
            if(seconds < 10) {
                seconds = "0" + seconds;
            }
            return minutes + ":" + seconds;
        }
        if(time < 10) {
            time = "0" + time;
        }
        return "0:" + time;
    }

    render() {
        let secondsLeft = this.props.secondsRemaining;
        let formattedTime = this.formatTime(secondsLeft);
        
        if(secondsLeft === 0) {
            return <h1>TIME'S UP!</h1>
        } 
        return(
            <div className="timer-container">
                <div className="timer-label">
                    TIME REMAINING:
                    </div>
                <div className="time">
                    {formattedTime}
                </div>
            </div>
        )
    };
};

export default Timer;