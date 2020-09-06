class Room{

    playerSockets;

    roomDetails = {
        roomOwner: '',
        roomCode: '',
        teamOne: [],
        teamTwo: [],
        score: { teamOne: 0, teamTwo: 0 },
        players: {},
        gameWords: [],
        startingTeam: '',
        currentTurnPlayer: '',
        currentTurnTeam: '',
        currentRound: 0,
        currentWord: '',
        nextPlayerIndex: 0,
        roundWordsLeft: [],
        gameSettings: {
            numberOfPlayers: 4,
            timePerTurn: 60,
            wordsPerPlayer: 3,
            numberOfRounds: 3
        },
        isGameStarted: false,
        isGamePaused: false,
    };
    
    constructor(roomOwnerSocket, roomCode, gameDetails) {
        // this.roomDetails.roomOwner = roomOwnerName;
        // this.roomDetails.players[roomOwnerName] = { name: roomOwnerName, team: "", score: 0, words: [] };
        this.playerSockets = [roomOwnerSocket];
        this.roomDetails.roomCode = roomCode;
        // set game settings
        this.roomDetails.gameSettings.numberOfPlayers = Number.parseInt(gameDetails.numberOfPlayers);
        this.roomDetails.gameSettings.timePerTurn = Number.parseInt(gameDetails.timePerTurn);
        this.roomDetails.gameSettings.wordsPerPlayer = Number.parseInt(gameDetails.wordsPerPlayer);
        this.roomDetails.gameSettings.numberOfRounds = Number.parseInt(gameDetails.numberOfRounds);
    };

    joinRoom(socket) {
        this.playerSockets.push(socket);
        //this.roomDetails.players[playerName] = { name: playerName, team: "", score: 0, words: [] };
    };

    notifyRoom(message, data) {
        this.playerSockets.forEach(playerSocket => {
            playerSocket.emit(message, data);
        })
    };

    resetRoom() {
        // clear all settings except players
        this.roomDetails.teamOne = [];
        this.roomDetails.teamTwo = [];
        this.roomDetails.score = { teamOne: 0, teamTwo: 0 };
        this.roomDetails.gameWords = [];
        this.roomDetails.startingTeam = '';
        this.roomDetails.currentTurnPlayer = '';
        this.roomDetails.currentTurnTeam = '';
        this.roomDetails.currentRound = 0;
        this.roomDetails.currentWord = '';
        this.roomDetails.nextPlayerIndex = 0;
        this.roomDetails.roundWordsLeft = [];
        this.roomDetails.isGameStarted = false;
        this.roomDetails.isGamePaused = false;

        // loop through all players and reset the score and words values
        for(const key of Object.keys(this.roomDetails.players)) {
            this.roomDetails.players[key].score = 0;
            this.roomDetails.players[key].words = [];
            this.roomDetails.players[key].team = "";
        }
    }
};

module.exports = { Room: Room};