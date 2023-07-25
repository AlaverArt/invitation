const express = require('express');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const telegramConfig = require('./telegramConfig.json');

const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(telegramConfig.botToken, {polling: true});

let corsOptions = {
    origin: ['http://localhost:5173'],
    //optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

class Application {
    constructor() {
        this.expressApp = express();
        this.expressApp.use(cors(corsOptions));
        this.expressApp.use(express.json());
        this.attachRoutes();
    }

    attachRoutes() {
        let app = this.expressApp;
        app.post('/form', this.postInviteFormHandler.bind(this));
    }

    async postInviteFormHandler(req, res) {
        const body = req.body;
        console.log(body);
        let response = { status: 'success' };
        try {
            const data = await fs.promises.readFile('./formAnswers.json', { encoding: 'utf-8'});
            const answers = JSON.parse(data);
            answers[body.name.trim()] = { name: body.name, age: body.age };
            await fs.promises.writeFile('./formAnswers.json', JSON.stringify(answers, null, 4), { encoding: 'utf-8' });
            const msg = `
                <b>Новый ответ</b>\n<b>Имя:</b> ${body.name.trim()}\n<b>Возраст:</b> ${body.age}\n
            `;
            bot.sendMessage(telegramConfig.chatId, msg, { parse_mode: 'HTML' });
        } catch (e) {
            //console.error(e);
            response.status = 'error';
            response.err = e.message;
        }
        res.json(response);
    }
}

module.exports = Application;