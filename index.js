var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {

    var user = Date.now();
    io.emit('message', `User ${user} connected`)

    socket.on('send', (msg) => {
        io.emit('message',`${user}: ${msg}`)
    })

    socket.on('name', (name) => {
        io.emit('message',`${user} changed name to ${name}`)
        user = name
    })

    socket.on('disconnect', () => {
        io.emit('message', `User ${user} disconnected`)
    });

    socket.on('typing', (name) => {
        socket.broadcast.emit('typing',`${user} is typing...`)
    })

})

http.listen(3000, () => console.log('Started server'))
