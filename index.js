//Делаем импорт
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)


//Запускаем рутовый маршрут
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


//Запускаем сокет
io.on('connection', (socket) => {

    //Задаем имя юзера и цвет при подключении
    var user = {
        name: Date.now(),
        color: `rgba(${Math.floor(Math.random() * (256))},${Math.floor(Math.random() * (256))},${Math.floor(Math.random() * (256))},0.5)`
    }


    //Отправить всем сообщение, что юзер подконнектился
    io.emit('message', {
        text: `User ${user.name} connected`,
        color: user.color
    })


    //Когда кто-то отправляет сообщения
    socket.on('send', (msg) => {
        io.emit('message', {
            text: `${user.name}: ${msg}`,
            color: user.color
        })
    })


    //Когда кто-то меняет имя
    socket.on('name', (name) => {
        io.emit('message', {
            text: `${user.name} changed name to ${name}`,
            color: user.color
        })
        user.name = name
    })

    //Когда кто-то дисконнектится
    socket.on('disconnect', () => {
        io.emit('message', {
            text: `User ${user.name} disconnected`,
            color: user.color
        })
    });

    //Когда кто-то печатает
    socket.on('typing', (name) => {
        socket.broadcast.emit('typing',`${user.name} is typing...`)
    })

})

http.listen(3000, () => console.log('Started server'))
