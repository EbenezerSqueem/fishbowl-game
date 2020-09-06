const express = require('express');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');

// import room object
const Room = require('./Room').Room;

let roomsByCode = {};
let roomsBySocket = {};

function getNextWord(roomDetails) {
    // console.log(roomDetails);
    let roundWordsLeft = roomDetails.roundWordsLeft;
    //console.log(roundWordsLeft);

    // if there is only one word left use it
    if(roundWordsLeft.length === 1) {
        roomDetails.currentWord =  roundWordsLeft[0];
        roomDetails.roundWordsLeft = [];
    } else {
        let randomIndex = Math.floor(Math.random() * roundWordsLeft.length);
        roomDetails.currentWord = roundWordsLeft[randomIndex];
        roundWordsLeft.splice(randomIndex, 1);
    }
    return roomDetails;
}

function socketEvents(socket) {

    socket.on('create-room', (gameDetails) => {

        let roomCode = Math.floor(Math.random() * 10000).toString();
        // console.log('Room code: ' + roomCode);

        const gameRoom = new Room(socket, roomCode, gameDetails);

        roomsByCode = {...roomsByCode, [roomCode]:gameRoom};
        // console.log(roomsByCode);
        roomsBySocket = {...roomsBySocket, [socket]:gameRoom}

        socket.emit("room-created", gameRoom.roomDetails, gameDetails.numberOfLocalPlayers);
        socket.on("disconnect", () => {
            try {
                currentRoom.notifyRoom("game-owner-disconnected");
                //socket.broadcast("game-owner-disconnected");
            } catch(err) {
                console.log(err);
            }

            // delete the room
            delete roomsByCode[roomCode];
            delete roomsBySocket[socket];
        });
    });

    socket.on("join-room", (roomCode, numberOfLocalPlayers) => {
        if(roomsByCode[roomCode] === undefined) {
            socket.emit("invalid-room-code");
        } else {
            let currentRoom = roomsByCode[roomCode];
            let roomDetails = currentRoom.roomDetails;
            currentRoom.joinRoom(socket);
            currentRoom.notifyRoom("user-joined-room", 
                {
                    roomCode,
                    roomDetails,
                    numberOfLocalPlayers
                }
            );

            roomsBySocket = {...roomsBySocket, [socket]: currentRoom};

            // // once room is full delete it from roomsByCode
            // if(currentRoom.roomDetails.numberOfPlayers == currentRoom.roomDetails.players.length) {
            //     delete roomsByCode[roomCode];
            // }
            socket.on("disconnect", () => {
                try {
                    // notify everyone user has left
                    currentRoom.notifyRoom("user-disconnected", 
                        {
                            username, 
                            roomDetails: currentRoom.roomDetails
                        }
                    );
                    //socket.broadcast("user-left-room", username);
                    // clean up room data to remove user
                    
                    // potentially add room back into roomsByCode if it had been delete because the room was full
                } catch(err) {
                    console.log(err);
                }
            })
        }
    });

    socket.on("submit-words", (username, roomCode, wordForm) => {
        if(roomsByCode[roomCode] === undefined) {
            socket.emit("error");
        } else if(roomsByCode[roomCode].roomDetails.players[username] !== undefined) {
            socket.emit("user-already-exists");
        } else {
            // add words to the room object
            let currentRoom = roomsByCode[roomCode];
            currentRoom.roomDetails.gameWords.push(...Object.values(wordForm));

            // add player to room players with player's words
            currentRoom.roomDetails.players[username] = 
                { 
                    name: username, 
                    team: "", 
                    score: 0, 
                    words: Object.values(wordForm) 
                };
            // add words to player object
            // currentRoom.roomDetails.players[username].words = Object.values(wordForm);
            
            // currentRoom.notifyRoom("update-game-state", currentRoom.roomDetails);
            currentRoom.notifyRoom("word-form-submitted", 
                {
                    gameRoom: currentRoom.roomDetails,
                    newUser: username
                }
            );
        }
    });

    socket.on("update-team", (username, roomCode, teamValue) => {
        if(roomsByCode[roomCode] === undefined) {
            socket.emit("error");
        } else {
            let currentRoom = roomsByCode[roomCode];
            if(teamValue !== "") {
                currentRoom.roomDetails[teamValue].push(username);
            }
            currentRoom.roomDetails.players[username].team = teamValue;

            currentRoom.notifyRoom("update-game-state", currentRoom.roomDetails);
        }
    })

    socket.on("start-game", roomCode => {
        // set isGameStarted to true
        if(roomsByCode[roomCode] === undefined) {
            socket.emit("error");
        } else {
            let currentRoom = roomsByCode[roomCode];
            currentRoom.roomDetails.isGameStarted = true;
            currentRoom.roomDetails.currentRound = 1;
            currentRoom.roomDetails.roundWordsLeft = [...currentRoom.roomDetails.gameWords];

            // set current turn settings: player and team
            // TODO put logic into assigning first team and player
            currentRoom.roomDetails.currentTurnPlayer = currentRoom.roomDetails.teamOne[0];
            currentRoom.roomDetails.currentTurnTeam = "teamOne";
            currentRoom.roomDetails.startingTeam = "teamOne";
            
            currentRoom.notifyRoom("update-game-state", currentRoom.roomDetails);
        }

        // remove game from roomsByCode to not allow additional users to join after game has started
        //delete roomsByCode[roomCode];
    });

    socket.on("start-turn", roomCode => {
        if(roomsByCode[roomCode] === undefined) {
            socket.emit("error");
        } else {
            let currentRoom = roomsByCode[roomCode];
            // get next word
            currentRoom.roomDetails = getNextWord(currentRoom.roomDetails);
            
            currentRoom.notifyRoom("turn-started", currentRoom.roomDetails);
        }
    });

    socket.on("toggle-pause", roomCode => {
        if(roomsByCode[roomCode] === undefined) {
            socket.emit("error");
        } else {
            roomsByCode[roomCode].roomDetails.isGamePaused = !roomsByCode[roomCode].roomDetails.isGamePaused;
            roomsByCode[roomCode].notifyRoom("toggle-pause", roomsByCode[roomCode].roomDetails);
        }
    });

    socket.on("correct-answer", (roomCode, username, team) => {
        if(roomsByCode[roomCode] === undefined) {
            socket.emit("error");
        } else {
            let currentRoom = roomsByCode[roomCode];
            let didRoundEnd = false;
            // update score
            currentRoom.roomDetails.score[team]++;
            currentRoom.roomDetails.players[username].score++;

            // check if there are no words left for this round
            if(currentRoom.roomDetails.roundWordsLeft.length === 0) {
                // end of the round! check if this is the end of the game
                    //console.log("1");
                if(currentRoom.roomDetails.currentRound === currentRoom.roomDetails.gameSettings.numberOfRounds) {
                    // end of game
                    //console.log("2");
                    currentRoom.notifyRoom("end-of-game", currentRoom.roomDetails);
                } else {
                    // update round and room details
                    //console.log("3");
                    currentRoom.roomDetails.currentRound++;
                    currentRoom.roomDetails.roundWordsLeft = [...currentRoom.roomDetails.gameWords];
                    currentRoom.roomDetails.isGamePaused = true;
                    didRoundEnd = true;
                }
            }
            currentRoom.roomDetails = getNextWord(currentRoom.roomDetails);
            
            //console.log(currentRoom.roomDetails);
            currentRoom.notifyRoom("correct", { gameRoom: currentRoom.roomDetails, didRoundEnd });
        }
    });

    socket.on("end-turn", roomCode => {
        if(roomsByCode[roomCode] === undefined) {
            socket.emit("error");
        } else {
            // put current word back into the array roundWordsLeft
            let currentRoom = roomsByCode[roomCode];
            currentRoom.roomDetails.roundWordsLeft.push(currentRoom.roomDetails.currentWord);
            currentRoom.roomDetails.currentWord = "";

            // update current team to next team
            // TODO Better logic
            let nextTeam = "";
            if(currentRoom.roomDetails.currentTurnTeam === "teamOne") {
                nextTeam = "teamTwo";
            } else {
                nextTeam = "teamOne";
            }
            currentRoom.roomDetails.currentTurnTeam = nextTeam;
            // update current player to next player up
            let nextPlayerIndex = currentRoom.roomDetails.nextPlayerIndex;
            if(nextTeam === currentRoom.roomDetails.startingTeam) {
                nextPlayerIndex++;
            }
            if((nextPlayerIndex + 1) >= currentRoom.roomDetails[nextTeam].length) {
                nextPlayerIndex = 0;
            }
            let nextPlayer = currentRoom.roomDetails[nextTeam][nextPlayerIndex];
            currentRoom.roomDetails.nextPlayerIndex = nextPlayerIndex;
            currentRoom.roomDetails.currentTurnPlayer = nextPlayer;

            // send room back
            currentRoom.notifyRoom("next-turn", currentRoom.roomDetails);
        }
    });

    socket.on("reset-game", roomCode => {
        if(roomsByCode[roomCode] === undefined) {
            socket.emit("error");
        } else {
            // put current word back into the array roundWordsLeft
            let currentRoom = roomsByCode[roomCode];
            currentRoom.resetRoom();
            currentRoom.notifyRoom("game-reset", currentRoom.roomDetails);
        }
    });
}

io.on('connection', socketEvents);

const port = process.env.PORT || 4000;

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('fishbowl-game-fe/build'));
    app.get('*', (req,res)=>{
        res.sendFile(path.join(__dirname,'fishbowl-game-fe','build','index.html'));
    });
} else {
    // app.use(express.static('fishbowl-game-fe/public'));    
    // app.get('*', (req,res)=>{
    //     res.sendFile(path.join(__dirname,'fishbowl-game-fe','public','index.html'));
    // });
    app.use(express.static('fishbowl-game-fe/build'));
    app.get('*', (req,res)=>{
        res.sendFile(path.join(__dirname,'fishbowl-game-fe','build','index.html'));
    });
}

server.listen(port);