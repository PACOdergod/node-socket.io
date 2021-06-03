const express = require('express')
const path = require('path')
require('dotenv').config()

const app = express()


// bandas
const Bands = require('./models/bands')
const Band = require('./models/band')
const bands = new Bands()

bands.addBand(new Band('Queen'))
bands.addBand(new Band('Bon Jovi'))
bands.addBand(new Band('Panda'))
bands.addBand(new Band('Poison'))

// console.log(bands);

// node Server
const server = require('http').createServer(app);
const io = require('socket.io')(server)

io.on('connection', client => {
    console.log('cliente conectado');

    //emito solo al que se esta conectando
    client.emit('active-bands', bands.getbands())

    client.on('disconnect', () => { 
        console.log('cliente desconectado');
    });

    client.on('votar', ( payload )=>{
        // console.log( payload );

        bands.voteBand( payload.id )
        // notificar a todos los dispositivos 
        // conectados al servidor
        client.emit('active-bands', bands.getbands())
    })

    // escuchar nueva banda
    client.on('new-band', ( payload )=>{
        console.log(payload);
        bands.addBand(new Band(payload.nombre))
        client.emit('active-bands', bands.getbands())
    })

    // eliminar banda
    client.on('delete-band', ( payload )=>{
        console.log(payload);
        bands.deleteBand(payload.id)
        client.emit('active-bands', bands.getbands())
    })


    client.on('nuevo-mensaje', ( payload )=>{
        // emite a todos menos al que envio el ensaje
        client.broadcast.emit('nuevo-mensaje', payload)
        console.log(payload);
    })
});

 

// Path Publico
const publicPath = path.resolve(__dirname, 'public')
app.use(express.static(publicPath))


server.listen(process.env.PORT, ( err )=>{
    if (err) throw new Error(err)
    console.log('servidor corriendo en puerto ', process.env.PORT);
})