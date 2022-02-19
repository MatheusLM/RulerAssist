const { ipcRenderer, ipcMain } = require('electron');
const fs = require('fs');

ipcRenderer.on('initial', e => {});
ipcRenderer.on('syncElements', elements => {
    for (let i = 0; i < elements.length; i++) {
        let prop = elements[i];
        let element = document.getElementById(prop);
        element.addEventListener('input', event => {
            let correctValue = element.value == 'on' ? element.checked : element.value;
            data['grid'][prop] = correctValue;
            setData();
            ipcRenderer.send('resync');
        });
    }
});

console.log('[Loaded] Listeners');
