
let text = {};

document.addEventListener('DOMContentLoaded', () => {
    const LOG = document.getElementById('LOG');
    const r = document.getElementById('r');
    Array.from(document.getElementsByClassName('b')).forEach(btn => {
        const id = btn.getAttribute('target');
        const target = document.getElementById(id);

        text[id] = {
            element: target,
            occupied: false,
            start: new Date(),
            value: 0
        };

        btn.addEventListener('click', () => {
            text[id].element.textContent = '00:00';
            text[id].occupied ? text[id].element.parentNode.classList.remove('occupied') : text[id].element.parentNode.classList.add('occupied');
            
            if (text[id].occupied) {
                const t = document.createElement('p');
                t.textContent = `${id}: ${text[id].start.toLocaleTimeString('FI-fi')} (${fmt(text[id].value)})`;
                LOG.appendChild(t);
            } else {
                text[id].start = new Date();
            }
            
            text[id].value = 0;
            text[id].occupied = !text[id].occupied;
        });
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
            if (!v.occupied && v.value > min) {
                min = v.value;
                tmp = k;
            }
            v.element.textContent = fmt(v.value);
        });

        r.textContent = tmp;
    }, 1000);
});
