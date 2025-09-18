const express = require('express')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const sequelize = require('./src/db/sequelize')
const auth = require('./src/auth/auth')
const http = require('http');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const publicKey = fs.readFileSync('./src/auth/jwtRS256.key.pub');

const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Token manquant"));
    }

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return next(new Error("Token invalide"));
        }
        socket.user = decoded;
        next();
    }); 
});

let messages = {};

io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    socket.on("joinMonument", ({monumentId, role}) => {
        socket.join(`monument_${monumentId}`);
        console.log(`${socket.user.userName} a rejoint la salle monument_${monumentId} en tant que ${role}`);

        if(!messages[monumentId]) 
            messages[monumentId] = [];

        socket.emit("chatHistory", messages[monumentId]);
    });

    socket.on("sendMessage", ({monumentId, role, message}) => {
        const msg = {
            user: socket.user.userName,
            role,
            message,
            date: new Date()
        };

        messages[monumentId].push(msg);
        io.to(`monument_${monumentId}`).emit("newMessage", msg);
    });
    
    socket.on('disconnect', () => {
        console.log('Un utilisateur est déconnecté');
    });
});



function nightBlocker (req, res, next){
    const hour = new Date().getHours();
    if(hour >= 0 && hour < 6 ){
        res.status(503).json({message: "Le serveur est en cours de maintenance", data: null})
    }else{
        next();
    }
}

sequelize.initDb()

app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(nightBlocker)
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan("dev"))
    .use(auth)
    
require('./src/docs/swagger')(app)

app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Monumento ! Utilisez les routes pour interagir avec les monuments.')
})

// Monuments routes
require('./src/routes/findAllMonuments.route')(app)
require('./src/routes/searchMonuments.route')(app)
require('./src/routes/findMonumentByPK.route')(app)
require('./src/routes/createMonument.route')(app)
require('./src/routes/updateMonument.route')(app)
require('./src/routes/deleteMonument.route')(app)

// Anecdote routes
require('./src/routes/findAnecdotesByMonument.route')(app)
require('./src/routes/createAnecdotes.route')(app)
require('./src/routes/updateAnecdote.route')(app)
require('./src/routes/deleteAnecdote.route')(app)

// User routes
require('./src/routes/login.route')(app)
require('./src/routes/register.route')(app)
require('./src/routes/refreshToken.route')(app)

app.use((req, res) => {
    const url = req.originalUrl
    const method = req.method
    const message = `La ressource demandée : "${method} ${url}" n'existe pas. Réessayez avec une autre URL.`
    res.status(404).json({ message, data: null })
})

server.listen(3000, () => console.log('Server & Socket.io running at http://localhost:3000'))

