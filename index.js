const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const session = require('express-session')

app.use(session({ secret: 'posseidonsecret', cookie: { maxAge: 14_400_000 } }))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.set('view engine', 'ejs')


const chatAuth = (req, res, next) => {
    if(req.session.nickname){
        next()
    } else {
        res.redirect('/')
    }
}

let count = 0
io.on('connection', (socket) => {
    count++
    io.emit('newPerson', count)

    socket.on('disconnect', () => {
        count--
        console.log(`O usuario ${socket.id} se desconectou.`)
    })

    socket.on('message', data => {
        console.log(data)
        io.emit('renderMessage', { author: data.author, message: data.message })
    })
})


app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    const nickname =  req.body.nickname
    
    req.session.nickname = nickname

    res.redirect('/chat')
})

app.get('/chat', chatAuth, (req, res) => {
    res.render('chat', { nickname: req.session.nickname })
})

http.listen(3000, () => console.log('Online'))