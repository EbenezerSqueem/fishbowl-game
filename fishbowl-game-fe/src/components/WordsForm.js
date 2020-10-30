import React, { Component } from "react";
import socket from "../apis/port";
import { onBlur, onFocus } from "../shared/utils";

export default class WordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      words: {},
      username: "",
      displayError: false,
      displayUserNameError: false,
      invalidUsernameError: false,
    };
  }

  componentDidMount() {
    socket.on("user-already-exists", () => {
      this.setState({
        invalidUsernameError: true,
      });
    });
  }

  updateWordsState = (e) => {
    let words = this.state.words;
    words[e.target.id] = e.target.value;
    if (this.props.numberOfWords === Object.keys(this.state.words).length) {
      this.setState({ displayError: false });
    }
    this.setState({
      words: words,
    });
  };

  updateUsername = (e) => {
    if (e.target.id === "username" && e.target.value.length > 0) {
      this.setState({
        username: e.target.value,
        displayUserNameError: false,
        invalidUsernameError: false,
      });
    }
  };

  clearForm = () => {
    // clear state values
    this.setState({
      words: {},
      username: "",
    });
    // clear username
    if (!this.props.isGameRestart) {
      document.getElementById("username").value = "";
    }
    // clear word inputs
    for (let i = 0; i < this.props.numberOfWords; i++) {
      document.getElementById("word-" + i).value = "";
    }
  };

  submitWords = (e) => {
    e.preventDefault();

    if (this.props.numberOfWords !== Object.keys(this.state.words).length) {
      this.setState({ displayError: true });
    } else if (this.state.username.length < 1) {
      this.setState({ displayUserNameError: true });
    } else {
      this.setState({
        displayError: false,
        displayUserNameError: false,
      });

      socket.emit(
        "submit-words",
        this.state.username,
        this.props.roomCode,
        this.state.words,
        this.props.isGameRestart
      );

      // clear form
      this.clearForm();
    }
  };

  render() {
    let wordInputs = [];
    for (let i = 0; i < this.props.numberOfWords; i++) {
      let placeholderText = "enter word " + (i + 1);
      wordInputs.push(
        <input
          id={"word-" + i}
          placeholder={placeholderText}
          onChange={this.updateWordsState}
          autocomplete="off"
          onFocus={onFocus}
          onBlur={(e) => onBlur(e, placeholderText)}
        />
      );
    }
    let usernameInput = [];
    if (this.props.isGameRestart) {
      // use usernames from first game
      let name = this.props.localUsers[this.props.numberOfUsersSubmitted];
      if (this.state.username !== name) {
        this.setState({
          username: name,
        });
      }
      usernameInput.push(
        <div className="word-form-details">Username: {name}</div>
      );
    } else {
      // allow users to enter new usernames
      usernameInput.push(
        <input
          id="username"
          placeholder="username"
          onChange={this.updateUsername}
          autocomplete="off"
          onBlur={(e) => onBlur(e, "username")}
          onFocus={onFocus}
        />
      );
    }

    return (
      <div className="word-form-container">
        <div className="word-form-label">Enter your game words</div>
        {this.props.numberOfLocalPlayers > 1 && (
          <div className="word-form-details">
            Player {this.props.numberOfUsersSubmitted + 1} of{" "}
            {this.props.numberOfLocalPlayers}
          </div>
        )}
        <div className="form-inputs">
          {usernameInput}
          {this.state.displayUserNameError && (
            <div className="input-error">please enter a username</div>
          )}
          {this.state.invalidUsernameError && (
            <div className="input-error">
              this username already exists, please select another
            </div>
          )}
          {wordInputs}
        </div>
        {this.state.displayError && (
          <div className="input-error">please enter all words</div>
        )}

        <button
          className="fb-game-btn"
          color="primary"
          onClick={this.submitWords}
        >
          Submit Words
        </button>
      </div>
    );
  }
}
