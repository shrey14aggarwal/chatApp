var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');

const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const user = require('./models/user')
const signup = require('./models/signup')


//connection to db 
mongoose.connect('mongodb://localhost:27017/chat')
    .then(() => {
        console.log("connected to database");
    }).catch(() => {
        console.log("connection error");
    })

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
    next();
})

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.post('/userlogin', (req, res, err) => {


    const User = new user({
        userName: req.body.userName,
        password: req.body.password
    })


    app.set('myname', req.body.userName)
    User.save();
})

app.post('/signup', (req, res, err) => {

    const Signup = new signup({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: req.body.password
    })

    Signup.save();
})

app.get('/getUsers:userName', (req, res, err) => {

    signup.find({ userName: req.params.userName }).then(documents => {
        res.json(documents);
    });
});

//get all users from the database
app.get('/getAllUsers', (req, res, err) => {
    signup.find().then(documents => {
        res.json(documents);
    })
})

app.post('/addFriendRequest', (req, res, err) => {
    console.log("friend is " + req.body.friend)
    signup.update({ 'userName': req.body.friend }, {
        $push: { 'incomingRequests': req.body.username }
    }).then(documents => {});

    signup.update({ 'userName': req.body.username }, { $push: { 'sentRequests': req.body.friend } }).then(documents => {});

})

app.get('/incomingRequests:username', (req, res, err) => {
    signup.find({ 'userName': req.params.username }, { 'incomingRequests': 1 }).then(documents => {
        res.json(documents)
    })
})

app.post('/confirmRequest', (req, res, err) => {
    signup.update({ 'userName': req.body.username }, { $pull: { 'incomingRequests': req.body.friend }, $push: { 'friend': req.body.friend } }).then(documents => {});

    signup.update({ 'userName': req.body.friend }, { $pull: { 'sentRequests': req.body.username }, $push: { 'friend': req.body.username } }).then(documents => {});
})

app.post('/unfriend', (req, res, err) => {
    signup.update({ 'userName': req.body.username }, { $pull: { 'friend': req.body.friend } }).then(documents => {});
    signup.update({ 'userName': req.body.friend }, { $pull: { 'friend': req.body.username } }).then(documents => {});

})

io.on('connection', (socket) => {

    console.log('a user connected');

    socket.on('newmessage', (msg) => {
        io.emit('incomingmessage', msg)
    })

    socket.on('joinRoom', (room) => {
        // socket.join(room);
        const rooms = Object.keys(socket.rooms);

        var i = 0

        socket.on('message', (msg) => {
            if (i == 0) {
                console.log("hi " + room + " " + msg)
                io.to(room).emit("message-broadcast", msg)
                i = i + 1;
            }
        })

        socket.on('typing', (msg) => {
            io.to(room).emit("user-typing", msg)
        })

    })

    socket.on('readyToJoin', (msg) => {
        socket.join(msg)
    })

    socket.on('fromto', (msg) => {

        var i = 0;

        io.emit("fromrequest", msg)

    })

    socket.on('to', (msg) => {

        io.emit("torequest", msg)
        console.log('msg2 is ', msg)
    })

    socket.on('confirmed', (msg) => {
        io.emit('requestconfirmed', msg)
    })


    socket.on('refreshed', (msg) => {
        io.emit('iamrefreshed', msg)
    })

    socket.on('online', (msg) => {
        console.log('mymsg' + (msg))
        io.emit('statusonline', msg);
    })

    socket.on('offline', (msg) => {
        io.emit('statusoffline', msg)
    })

    socket.on('wantchat', (msg) => {

        io.emit('wanttochat', msg)
    })

    socket.on('disconnecting', () => {
        const rooms = Object.keys(socket.rooms);
        // the rooms array contains at least the socket ID
        for (var i = 0; i < rooms.length; i++) {
            socket.leave(rooms[i])
        }

    });

    socket.on('disconnecting', () => {
        const rooms = Object.keys(socket.rooms);
        for (let i = 0; i < rooms.length; i++) {
            socket.leave(rooms[i]);
        }
    });

    socket.on('unfriend', (msg) => {
        io.emit('unfriended', msg)
    })

});

http.listen(3000, () => {
    console.log('listening on *:3000');
});