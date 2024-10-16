const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: '*',
    methods: "*",
    allowedHeaders: "*",
};

app.use(cors(corsOptions));
const server = http.createServer(app);
const io = new Server(server);

let timerValue = 10; // Таймер в секундах  

function startTimer() {
    setInterval(() => {
        timerValue = (timerValue - 1 + 10) % 10; // Обновление таймера  
        io.emit('timerUpdate', timerValue); // Отправка обновления всем пользователям  
    }, 1000); // Каждую секунду  
}

io.on('connection', (socket) => {
    console.log('Пользователь подключился');
    socket.emit('timerUpdate', timerValue); // Отправка текущего значения таймера  

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

server.listen(3001, () => {
    console.log('Сервер слушается на порту: 3001');
    startTimer(); // Запуск таймера на сервере  
});