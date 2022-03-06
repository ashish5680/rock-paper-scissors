const rooms = {};

const createRoom = (roomId, player1Id) => {
    rooms[roomId] = [player1Id, ""];
}


const joinRoom = (roomId, player2Id) => {
    rooms[roomId][1] = player2Id;     // rooms[roomId][1] this is the second element of the array
}



const exitRoom = (roomId, player) => {
    if(player === 1){                   // if our player is 1 who created the room then he will delete the whole room
        delete rooms[roomId];    
    }
    else{
        rooms[roomId][1] = "";
    }
}



module.exports = {rooms, createRoom, joinRoom, exitRoom};