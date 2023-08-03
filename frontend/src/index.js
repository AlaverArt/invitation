import '@/styles/main.scss';
import '../index.html';
import { createTimer } from './timer';

const backendURL = 'http://localhost:3000';

async function sendConfirm() {
    const name = this.confirmInputName.value.trim();
    const count = Number(this.confirmInputCount.value?.trim() ?? 1);

    if (!(name && count)) {
        alert('Для подтверждения участия заполните имя и кол-во человек');
        return;
    }

    try {
        this.msgContainer.classList.add('hidden');
        this.confirmBtn.classList.add('loading');
        let resp = await fetch(backendURL + '/confirm', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                name,
                count
            }),
        });

        if (resp.status !== 200) {
            throw await resp.json();
        }

        localStorage.setItem('confirm', JSON.stringify({ name, count }));
        checkUserConfirm.bind(this)();
    } catch(e) {
        console.log(e);
        handleConfirmError.bind(this)(e.errCode, e.errMsg);
    } finally {
        this.confirmBtn.classList.remove('loading');
    }
}

function handleConfirmError(code, msg) {
    this.msgTextContainer.textContent = msg || 'Не удалось подтвердить. Обновите страницу и попробуйте снова';
    this.msgContainer.classList.remove('hidden');
    this.deleteConfirmBtn.classList.add('hidden');
}

function checkUserConfirm() {
    let data = localStorage.getItem('confirm');
    if (!data) return;
    data = JSON.parse(data);

    this.msgTextContainer.textContent = `Вы подтвердили своё участие: ${data.name} ${data.count} чел.`;
    this.msgItemConfirm.classList.add('hidden');
    this.deleteConfirmBtn.classList.remove('hidden');

    this.msgContainer.classList.remove('hidden');
}

async function sendDeleteConfrim() {
    const data = localStorage.getItem('confirm');
    if (!data) return;
    try {
        this.deleteConfirmBtn.classList.add('loading');
        await fetch(backendURL + '/delete-confirm', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json;charset=utf-8',
            },
            body: data,
        });
        localStorage.removeItem('confirm');
        window.location.reload();
    } catch(e) {
        console.log(e);
    } finally {
        this.deleteConfirmBtn.classList.remove('loading');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const timerElem = document.querySelector('.timer');
    const timerMinValue = timerElem.querySelector('.m .value');
    const timerHourValue = timerElem.querySelector('.h .value');
    const timerDayValue = timerElem.querySelector('.d .value');
    const timerWeekValue = timerElem.querySelector('.w .value');

    const updateTimerElem = ({ minute, hour, day, week }) => {
        timerMinValue.textContent = minute;
        timerHourValue.textContent = hour;
        timerDayValue.textContent = day;
        timerWeekValue.textContent = week;
    }

    const tm = createTimer('2023-09-23 16:30:00 GMT+0300', updateTimerElem);

    const elems = {};
    elems.confirmBtn = document.querySelector('.confirm__btn');
    elems.confirmInputName = document.querySelector('.confirm__input.name');
    elems.confirmInputCount = document.querySelector('.confirm__input.count');

    elems.msgContainer = document.querySelector('.confirm-message-container');
    elems.msgTextContainer = elems.msgContainer.querySelector('.msg-text');
    elems.deleteConfirmBtn = elems.msgContainer.querySelector('.delete-confirm-button');
    elems.msgItemConfirm = document.querySelector('.message__item.confirm');

    checkUserConfirm.bind(elems)();

    elems.confirmBtn.addEventListener('click', sendConfirm.bind(elems));
    elems.deleteConfirmBtn.addEventListener('click', sendDeleteConfrim.bind(elems));
});
