const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');


const app = express();    // create our application 
const server = http.createServer(app);


const io = socketio(server);      // to listen socket.io connections


app.use('/', express.static(path.join(__dirname, 'public')));



// Import users and rooms in a destructure format
const {connectedUsers, initializeChoices, userConnected, makeMove, moves, choices} = require("./util/users");
const {rooms, createRoom, joinRoom, exitRoom} = require("./util/rooms");
// everytime when your socket connects we need to keep a track of rooms and users we have


const e = require("express");
const { exitCode } = require("process");




// in order to listen eveytime from a connection
io.on('connection', (socket) => {

    // console.log(`Connection Established --> ${socket.id}`);
               //event
    socket.on("create-room", (roomId) => {
        if(rooms[roomId]){
            const error = "This room is already Exists";
            socket.emit("display-error", error);
        }
        else{
            userConnected(socket.client.id);
            createRoom(roomId, socket.client.id);
            socket.emit("room-created", roomId);        // Emit an Event
            socket.emit("player-1-connected");
            socket.join(roomId);
        }
    });


    socket.on("join-room" , (roomId) => {
        if(!rooms[roomId]){
            const error = "This room doesn't Exists";
            socket.emit("display-error", error);
        }
        else{
            userConnected(socket.client.id);
            joinRoom(roomId, socket.client.id);
            socket.join(roomId);

            socket.emit("room-joined", roomId);
            socket.emit("player-2-connected");
            socket.broadcast.to(roomId).emit("player-2-connected");
            initializeChoices(roomId);
        }
    });


    socket.on("join-random" , ()=> {
        
        let roomId = "";

        for(let id in rooms){
            if(rooms[id][1] === ""){
                roomId = id;
                break;
            }
        }

        if(roomId === ""){
            const error = "All rooms are full or none exists";
            socket.emit("display-error", error);
        }

        else{
            userConnected(socket.client.id);
            joinRoom(roomId, socket.client.id);
            socket.join(roomId);

            socket.emit("room-joined", roomId);
            socket.emit("player-2-connected");
            socket.broadcast.to(roomId).emit("player-2-connected");
            initializeChoices(roomId);
        }

    });





    socket.on("make-move", ({playerId, myChoice, roomId}) => {

        makeMove(roomId, playerId, myChoice);       // call the function

        if(choices[roomId][0] !== "" && choices[roomId][1] !== ""){

            let playerOneChoice = choices[roomId][0];
            let playerTwoChoice = choices[roomId][1];

            if(playerOneChoice === playerTwoChoice){
                let message = "Both of you choose " + playerOneChoice + " . So it's draw";
                io.to(roomId).emit("draw", message);
                
            }
            else if(moves[playerOneChoice] === playerTwoChoice){
                let enemyChoice = "";

                if(playerId === 1){
                    enemyChoice = playerTwoChoice;
                }else{
                    enemyChoice = playerOneChoice;
                }

                io.to(roomId).emit("player-1-wins", {myChoice, enemyChoice});

            }
            else{

                let enemyChoice = "";

                if(playerId === 1){
                    enemyChoice = playerTwoChoice;
                }else{
                    enemyChoice = playerOneChoice;
                }

                io.to(roomId).emit("player-2-wins", {myChoice, enemyChoice});
            }

            choices[roomId] = ["", ""];
        }
    });





    socket.on("disconnect", () => {
        
        if(connectedUsers[socket.client.id]){
            let player;
            let roomId;

            for(let id in rooms){

                if(rooms[id][0] === socket.client.id || rooms[id][1] === socket.client.id){

                    if(rooms[id][0] === socket.client.id){
                        player = 1;
                    }else{
                        player = 2;
                    }

                    roomId = id;
                    break;
                }
            }

            exitRoom(roomId, player);

            if(player === 1){
                io.to(roomId).emit("player-1-disconnected");
            }else{
                io.to(roomId).emit("player-2-disconnected");
            }
        }
    })




    
    // socket.on('send_msg', (data) => {

    //     io.emit('recieved_msg', {
    //         msg: data.msg,
    //         // id: socket.id
    //         user: users[socket.id]
    //     })

    // });

    // socket.on('login', (data) => {
    //     users[socket.id] = data.user;      // key value mapping kar di idhar
    // });

});














// heroku is going to pass this port || localhost port
const port = process.env.PORT || 3000;
server.listen(port, () => {          
    console.log(`server running at port ${port}`);      
});