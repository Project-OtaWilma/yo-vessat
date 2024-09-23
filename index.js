
let text = {};
let logs = [];

document.addEventListener('DOMContentLoaded', () => {
    const LOG = document.getElementById('LOG');
    const DOWNLOAD = document.getElementById('DOWNLOAD');
    const r = document.getElementById('r');
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') ?? 'unknown';
    document.getElementById('NAME').textContent = name;

    Array.from(document.getElementsByClassName('b')).forEach(btn => {
        const id = btn.getAttribute('target');
        const target = document.getElementById(id);

        if (urlParams.has(id)) {
            target.parentNode.classList.add('disabled');
            target.textContent = 'Pois käytöstä';
            return;
        }

        text[id] = {
            element: target,
            occupied: false,
            disabled: false,
            start: new Date(),
            value: 0
        };

        btn.addEventListener('click', () => {
            text[id].element.textContent = '00:00';
            text[id].occupied ? text[id].element.parentNode.classList.remove('occupied') : text[id].element.parentNode.classList.add('occupied');
            
            if (text[id].occupied) {
                const t = document.createElement('p');
                
                const data = `${id}: ${text[id].start.toLocaleTimeString('FI-fi')} - ${(new Date()).toLocaleTimeString('FI-fi')} (${fmt(text[id].value)})`;
                const rawData = `${id}/${text[id].start.getTime()}/${(new Date()).getTime()}/${text[id].value}`;
                t.textContent = data;
                logs.push(rawData);
                LOG.appendChild(t);
            } else {
                text[id].start = new Date();
            }
            
            text[id].value = 0;
            text[id].occupied = !text[id].occupied;
        });
    });

    DOWNLOAD.addEventListener('click', () => {
        download(`${name}-logs.txt`, logs.join('\n'));
    });

    const fmt = (v) => {
        let minutes = Math.floor(v / 60);
        let seconds = v % 60;

        return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
    }

    setInterval(() => {
        let min = 0;
        let tmp = 'null';
        Object.keys(text).forEach(k => {
            let v = text[k];
            v.value += 1;
            if (!v.occupied && !v.disabled && v.value > min) {
                min = v.value;
                tmp = k;
            }
            v.element.textContent = fmt(v.value);
        });

        r.textContent = tmp;
    }, 1000);
});
