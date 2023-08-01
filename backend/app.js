const express = require('express');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const telegramConfig = require('./telegramConfig.json');

const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(telegramConfig.botToken, {polling: true});

let corsOptions = {
    origin: ['http://localhost:8080'],
    //optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

function renderMessage(comfirmData) {
    const dtFormatter = new Intl.DateTimeFormat('ru', { hour: '2-digit', minute: '2-digit' });
    let result = '';
    let userList = '';
    let allUsersCount = 0;
    let i = 1;

    for(const [name, user] of Object.entries(comfirmData)) {
        const countNum = Number(user.count);
        const confirmDate = dtFormatter.format(new Date(user.confirmDate));

        userList += `${i}. ${user.name} (${Math.abs(countNum)} чел., ${confirmDate ?? ''})\n\n`;
        allUsersCount += Math.abs(countNum);

        i++;
    }

    result += `<b>Количество гостей ${allUsersCount}</b>\n\n`;
    result += userList;
    return result;
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
        app.post('/confirm', this.postConfirmationHandler.bind(this));
    }

    async postConfirmationHandler(req, res) {
        const body = req.body;
        console.log(body);
        let response = { status: 'success', err: null };
        let data = null;

        // read confirmation file
        try {
            data = await fs
            .promises
            .readFile('./confirm_data.json', { encoding: 'utf-8'});
        } catch (e) {
            data = '{}';
        }

        try {
            const answers = JSON.parse(data);
            const name = body.name?.trim();
            const count = Number(body.count ?? 0);
            const confirmDate = new Date().getTime();
            
            if (!(name && count)) throw new Error('Не заполнено имя или количество человек');
            
            // write new confirmation
            answers[name] = { name, count, confirmDate };
            await fs
                .promises
                .writeFile(
                    './confirm_data.json',
                    JSON.stringify(answers, null, 4),
                    { encoding: 'utf-8' }
                );
            
            // delete last message if exists
            if (telegramConfig.lastMessageId)
                await bot.deleteMessage(telegramConfig.chatId, telegramConfig.lastMessageId);
            
            // send updated message
            const msg = renderMessage(answers);
            const newMsg = await bot.sendMessage(telegramConfig.chatId, msg, { parse_mode: 'HTML' });

            // write new lastMessageId
            telegramConfig.lastMessageId = newMsg.message_id;            
            await fs.promises.writeFile(
                './telegramConfig.json',
                JSON.stringify(telegramConfig, null, 4),
                { encoding: 'utf-8' }
            );
        } catch (e) {
            response.status = 'error';
            response.err = e.message;
            res.json(response);
        }
        res.json(response);
    }
}

module.exports = Application;