const express = require('express');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const telegramConfig = require('./telegramConfig.json');

const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(telegramConfig.botToken, {polling: true});

let corsOptions = {
    origin: ['http://95.163.234.38', 'https://95.163.234.38', 'http://localhost:8080'],
    //optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

function renderMessage(comfirmData) {
    const dtFormatter = new Intl.DateTimeFormat('ru', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    let result = '';
    let userList = '';
    let allUsersCount = 0;
    let i = 1;

    for(const [name, user] of Object.entries(comfirmData)) {
        const countNum = Number(user.count);
        const confirmDate = dtFormatter.format(new Date(user.confirmDate + (new Date()).getTimezoneOffset()*60*1000));

        userList += `${i}. ${user.name}\n[ ${Math.abs(countNum)} чел. ]    ${confirmDate ?? ''}\n\n`;
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
        app.post('/delete-confirm', this.postDeleteConfrimationHandler.bind(this));
    }

    async postDeleteConfrimationHandler(req, res) {
        const body = req.body;
        console.log(body);
        const name = body.name?.trim();
        let response = { errCode: null, errMsg: null };
        let data = null;
        let newMsg = null;
        // read confirmation file
        try {
            data = await fs
            .promises
            .readFile('./confirm_data.json', { encoding: 'utf-8'});
        } catch (e) {
            data = '{}';
        }
        let answers = JSON.parse(data);
        if (answers[name]) {
            delete answers[name];
            await fs
                .promises
                .writeFile(
                    './confirm_data.json',
                    JSON.stringify(answers, null, 4),
                    { encoding: 'utf-8' }
                );

            // delete last message if exists
            if (telegramConfig.lastMessageId)
            try {
                await bot.deleteMessage(telegramConfig.chatId, telegramConfig.lastMessageId);
            } catch (e) {
                console.log(e);
            }
            // send updated message
            try {
                const msg = renderMessage(answers);
                newMsg = await bot.sendMessage(telegramConfig.chatId, msg, { parse_mode: 'HTML' });

                // send file for safety
                await bot.sendDocument(telegramConfig.backupChatId, 'confirm_data.json', {}, { contentType: 'application/json' });

                // write new lastMessageId
                telegramConfig.lastMessageId = newMsg?.message_id ?? null;            
                await fs.promises.writeFile(
                    './telegramConfig.json',
                    JSON.stringify(telegramConfig, null, 4),
                    { encoding: 'utf-8' }
                );

            } catch (e) {
                try {
                    await bot.sendMessage(telegramConfig.backupChatId, `УДАЛЕНИЕ \n\n${e.message}\n\n${e.sourceErrMsg}`, { parse_mode: 'HTML' });
                } catch (err) {
                    console.log(err);
                }

                response.errCode = e.code;
                response.errMsg = e.message;
                res.status(200).json(response);
                return;
            }
        }

        res.status(200).json(response);
    }

    async postConfirmationHandler(req, res) {
        const body = req.body;
        console.log(body);
        let response = { errCode: null, errMsg: null };
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
            let newMsg = null;
            
            if (!(name && count)) {
                const newErr = new Error('Не заполнено имя или количество человек');
                newErr.code = 'empty_name';
                newErr.sourceErrMsg = null;
                throw newErr;
            }
            if (answers[name]) {
                const newErr = new Error('Человек с таким ФИО уже зарегистрирован. Если это вы, то вы можете отменить регистрацию с того же устройства, на котором она производилась, и зарегистрироваться заново');
                newErr.code = 'exist_name';
                newErr.sourceErrMsg = null;
                throw newErr;
            }

            try {
                // write new confirmation
                answers[name] = { name, count, confirmDate };
                await fs
                    .promises
                    .writeFile(
                        './confirm_data.json',
                        JSON.stringify(answers, null, 4),
                        { encoding: 'utf-8' }
                    );
            } catch (err) {
                const newErr = new Error('Не удалось подтвердить участие');
                newErr.code = 'unknown';
                newErr.sourceErrMsg = err.message;
                throw newErr;
            }
            
            // delete last message if exists
            if (telegramConfig.lastMessageId)
                try {
                    await bot.deleteMessage(telegramConfig.chatId, telegramConfig.lastMessageId);
                } catch (e) {
                    console.log(e);
                }
            
            // send updated message
            try {
                const msg = renderMessage(answers);
                newMsg = await bot.sendMessage(telegramConfig.chatId, msg, { parse_mode: 'HTML' });

                // send file for safety
                await bot.sendDocument(telegramConfig.backupChatId, 'confirm_data.json', {}, { contentType: 'application/json' });
            } catch (e) {
                // undo file changes
                delete answers[name];
                await fs
                    .promises
                    .writeFile(
                        './confirm_data.json',
                        JSON.stringify(answers, null, 4),
                        { encoding: 'utf-8' }
                    );
                const newErr = new Error('Не удалось подтвердить участие');
                newErr.code = 'unknown';
                newErr.sourceErrMsg = e.message;
                throw newErr;
            }

            // write new lastMessageId
            telegramConfig.lastMessageId = newMsg?.message_id ?? null;            
            await fs.promises.writeFile(
                './telegramConfig.json',
                JSON.stringify(telegramConfig, null, 4),
                { encoding: 'utf-8' }
            );
        } catch (e) {
            try {
                await bot.sendMessage(telegramConfig.backupChatId, `${e.message}\n\n${e.sourceErrMsg}`, { parse_mode: 'HTML' });
            } catch (err) {
                console.log(err);
            }

            response.errCode = e.code;
            response.errMsg = e.message;
            res.status(404).json(response);
            return;
        }
        res.status(200).json(response);
        return;
    }
}

module.exports = Application;
