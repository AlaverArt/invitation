import '@/styles/main.scss';
import '../index.html';
import { createTimer } from './timer';

const backendURL = 'http://95.163.234.38:3000';

async function sendConfirm() {
    const name = this.confirmInputName.value.trim();
    const count = Number(this.confirmInputCount.value?.trim() ?? 1);
    console.log(name, count);

    if (!(name && count)) {
        alert('Для подтверждения участия заполните имя и кол-во человек');
        return;
    }

    try {
        await fetch(backendURL + '/confirm', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                name,
                count
            }),
        });
    } catch(e) {
        console.error(e);
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

    const confirmBtn = document.querySelector('.confirm__btn');
    const confirmInputName = document.querySelector('.confirm__input.name');
    const confirmInputCount = document.querySelector('.confirm__input.count');
    
    confirmBtn.addEventListener('click', sendConfirm.bind({ confirmInputCount, confirmInputName }));
})
