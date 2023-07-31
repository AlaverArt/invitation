export function createTimer(date, callback, reloadInMs = 30000) {
    const target = date instanceof Date ? date.getTime() : new Date(date).getTime();
    const msInMin = 60000;
    const minInH = 60;
    const hInDay = 24;
    const dInWeek = 7;

    const tick = () => {
        const now = new Date().getTime();
        const diff = Math.abs(target - now);

        const min = diff / msInMin;
        const h = min / minInH;
        const d = h / hInDay;
        const w = d / dInWeek;
        
        const minute = Math.floor(min) % minInH;
        const hour = Math.floor(h) % hInDay;
        const day = Math.floor(d) % dInWeek;
        const week = Math.floor(w);

        try {
            callback({ minute, hour, day, week});
        } catch(e) {
            console.error(e);
        }
    };
    tick();
    return setInterval(tick, reloadInMs);
}