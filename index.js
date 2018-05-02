
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



io.on('connection', (socket) => {

    var user = {
        name: Date.now(),
        color: `rgba(${Math.floor(Math.random() * (256))},${Math.floor(Math.random() * (256))},${Math.floor(Math.random() * (256))},0.5)`
    }


    io.emit('message', {
        text: `User ${user.name} connected`,
        color: user.color
    })


    socket.on('send', (msg) => {
        io.emit('message', {
            text: `${user.name}: ${msg}`,
            color: user.color
        })
    })


    socket.on('name', (name) => {
        io.emit('message', {
            text: `${user.name} changed name to ${name}`,
            color: user.color
        })
        user.name = name
    })

    socket.on('disconnect', () => {
        io.emit('message', {
            text: `User ${user.name} disconnected`,
            color: user.color
        })
    });

    socket.on('typing', (name) => {
        socket.broadcast.emit('typing',`${user.name} is typing...`)
    })

})

http.listen(3000, () => console.log('Started server'))
