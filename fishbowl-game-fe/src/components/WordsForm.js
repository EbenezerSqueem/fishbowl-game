import React, { Component } from 'react';
import socket from '../apis/port';
import { onBlur, onFocus } from '../shared/utils';

export default class WordForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            words: {},
            displayError: false
        }
    }

    updateWordsState = (e) => {
        let words = this.state.words;
        words[e.target.id] = e.target.value;
        if(this.props.numberOfWords === Object.keys(this.state.words).length) {
            this.setState({ displayError: false });
        }
        this.setState({
            words: words
        });
    }

    submitWords = (e) => {
        e.preventDefault();

        if(this.props.numberOfWords === Object.keys(this.state.words).length) {
            this.setState({ displayError: false });

            // TODO form validation
            socket.emit("submit-words", this.props.username, this.props.roomCode, this.state.words);

            // call submitted words prop
            this.props.submittedWords();
        } else {
            this.setState({ displayError: true });
        }
    }

    render() {
        let wordInputs = [];
        for(let i=0; i<this.props.numberOfWords; i++) {
            let placeholderText = "enter word " + (i+1);
            wordInputs.push(
                <input id={"word-" + i} 
                    placeholder={placeholderText} 
                    onChange={this.updateWordsState} 
                    autocomplete="off" 
                    onFocus={onFocus}
                    onBlur={(e) => onBlur(e, placeholderText)}
                />
            );
        }
        return (
            <div className="word-form-container">
                <div className="form-inputs">
                    {wordInputs}
                </div>
                {this.state.displayError && <div className="input-error">please enter all words</div>}

                <button className="fb-game-btn" color="primary" onClick={this.submitWords}>Submit Words</button>
            </div>
        )
    }
};
