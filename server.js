//Делаем импорт
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


const pushAndEmit = msg => {
    if(msgs.length >= maxLen) msgs = []
    msgs.push(msg)
    io.emit('message', msg)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Запускаем рутовый маршрут
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

//Указываем путь к статическим файлам
app.use(express.static(__dirname + '/public'))

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Параметры чата
let msgs = []
let membersCount = 0
const maxLen = 100

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Запускаем сокет
io.on('connection', (socket) => {

    //Отправляем новому юзеру количество участников чата
    membersCount++
    socket.emit('members', membersCount)

    //И всем остальным говорим, что юзеров теперь на 1 больше
    socket.broadcast.emit('connected')

    //Задаем имя юзера и цвет при подключении
    var user = {
        name: Date.now(),
        color: `rgba(${Math.floor(Math.random() * (256))},${Math.floor(Math.random() * (256))},${Math.floor(Math.random() * (256))},0.5)`
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Создать сообщение и добавить в бд
    let msg = {
        text: `User ${user.name} connected`,
        color: user.color
    }
    msgs.push(msg)

    //Отправить новому юзеру всю историю сообщений
    msgs.map(msg => socket.emit('message', msg))

    //Отправить всем сообщение, что юзер подконнектился
    socket.broadcast.emit('message', msg)


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //Когда кто-то отправляет сообщения
    socket.on('send', msg => {
        pushAndEmit({
            text: `${user.name}: ${msg}`,
            color: user.color
        })
    })


    //Когда кто-то меняет имя
    socket.on('name', name => {
        pushAndEmit({
            text: `${user.name} changed name to ${name}`,
            color: user.color
        })
        user.name = name
    })

    //Когда кто-то дисконнектится
    socket.on('disconnect', () => {
        membersCount--
        io.emit('disconnected')
        pushAndEmit({
            text: `User ${user.name} disconnected`,
            color: user.color
        })
    })

    //Когда кто-то печатает
    socket.on('typing', (name) => {
        socket.broadcast.emit('typing',`${user.name} is typing...`)
    })

})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 3000;
http.listen(port, () => console.log('Started server'))
