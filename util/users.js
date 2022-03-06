const connectedUsers = {};

const choices = {};

const moves = {            // to make key a winner
    "rock" : "scissors",
    "paper" : "rock",
    "scissors" : "paper"
};

const initializeChoices = (roomId) => {
    choices[roomId] = ["" , ""];
}


const userConnected = (userId) => {
    connectedUsers[userId] = true;
}


const makeMove = (roomId, player, choice) => {
    if(choices[roomId]){
        choices[roomId][player - 1] = choice;
    }
}



module.exports = {connectedUsers, initializeChoices, userConnected, makeMove, moves, choices};
