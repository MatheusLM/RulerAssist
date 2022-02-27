const { ipcRenderer, ipcMain } = require('electron');

ipcRenderer.on('initial', e => {});

ipcRenderer.on('syncElements', elements => {
    for (let i = 0; i < elements.length; i++) {
        let prop = elements[i];
        let element = document.getElementById(prop);
        element.addEventListener('input', event => {
            let correctValue = element.value == 'on' ? element.checked : Number(element.value);
            data['grid'][prop] = correctValue;
            setData();
            ipcRenderer.send('resync');
            if (prop != 'dark' || prop != 'rotate') ipcRenderer.send('updateMarkers');
            if (prop == 'dark') ipcRenderer.send('updateDarkMode');
        });
    }
});

console.log('[Loaded] Listeners');
