const express = require('express')
const path = require('path')
require('dotenv').config()

const app = express()


// node Server
const server = require('http').createServer(app);
const io = require('socket.io')(server)

io.on('connection', client => {
    console.log('cliente conectado');
    // client.on('event', data => { /* … */ });
    client.on('disconnect', () => { 
        console.log('cliente desconectado');
    });

    client.on('mensaje', ( payload )=>{
        console.log('server recibio ', payload);

        io.emit('mensaje', {server: 'nuevo nombre'})
    })
});

 

// Path Publico
const publicPath = path.resolve(__dirname, 'public')
app.use(express.static(publicPath))


server.listen(process.env.PORT, ( err )=>{
    if (err) throw new Error(err)
    console.log('servidor corriendo en puerto ', process.env.PORT);
})