////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var socket = io()
setTimeout(() => window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight), 100)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

new Vue({
    el: '.chat',
    data: {
        message: '',
        name: '',
        typing: '',
        interval: null,
        messages: [],
        membersCount: 0
    },

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    methods: {
        send: function (e) {
            if (e.keyCode !== 13) {
                socket.emit('typing', this.name)
                return
            }
            if(this.message === '') return
            socket.emit('send', this.message)
            this.message = ''
        },

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        setName: function(e) {
            if (e.keyCode !== 13) {
                return
            }
            socket.emit('name', this.name)
            this.name = ''
        }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    },
    created: function () {

        socket.on('message', function (message) {
            document.title = "New message!"
            setTimeout(() => document.title = "Chat", 1000)
            console.log(message)
            this.messages.push(message)
            this.typing = ''
            document.getElementsByClassName("empty")[0].scrollIntoView(false)
        }.bind(this))


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        socket.on('typing', function (message) {
            this.typing = message
            if (!this.interval) this.interval = setTimeout(() => {
                this.interval = null
                this.typing = ''
            }, 2000)
        }.bind(this))

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        socket.on('connected', function() {
            document.getElementsByClassName("membersCount")[0].classList.add("newMemberAnim")
            setTimeout(() => document.getElementsByClassName("membersCount")[0].classList.remove("newMemberAnim"), 700)
            this.membersCount++
        }.bind(this))

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        socket.on('disconnected', function() {
            document.getElementsByClassName("membersCount")[0].classList.add("newMemberAnim")
            setTimeout(() => document.getElementsByClassName("membersCount")[0].classList.remove("newMemberAnim"), 700)
            this.membersCount--
        }.bind(this))

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        socket.on('members', function(count) {
            this.membersCount = count
        }.bind(this))

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    }
})
