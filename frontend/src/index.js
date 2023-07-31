import '@/styles/main.scss';
import '../index.html';
import { createTimer } from './timer';

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
})
