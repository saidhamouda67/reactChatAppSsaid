const express=require('express');
const socketIo=require('socket.io');
const http=require('http');
const {addUser,removeUser,getUsersInRoom,getUser}=require('./users')
const PORT=process.env.PORT || 5000;
const router=require('./router');
const app=express();
const cors=require('cors')
const server=http.createServer(app);
const io=socketIo(server);

io.on('connection',(socket)=>{
    console.log('we have a new connection');


    socket.on('join',({name,room},callback)=>{
        console.log(name,room);
        const {user,error}=addUser({id:socket.id,name,room})
        if(error){
            return callback(error);
        }
        socket.emit('message',{user:'admin',text:`${user.name},welcome to the room ${user.room}`})
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has joined!`})
        socket.join(user.room);

        io.to(user.room).emit('roomData',{room: user.room,users:getUsersInRoom(user.room)})


        callback();
    });
    socket.on('sendMessage',(message,callback)=>{
        const user=getUser(socket.id);
        io.to(user.room).emit('message',{user:user.name,text:message})
        io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)})
        callback();
    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',{ user:'admin',text:`${user.name} has left.`})
            io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)})

        }
        console.log('user had left !!!');
    })
})
app.use(router);
app.use(cors);
server.listen(PORT,()=>console.log(`server started on port ${PORT}`));
