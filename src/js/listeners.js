const { ipcRenderer, ipcMain } = require('electron');
const fs = require('fs');

/* elements['height'].addEventListener('input', e => {
    data['grid']['height'] = Number(elements['height'].value);
    setData();
    ipcRenderer.send('resync');
}); */

console.log('[Loaded] Listeners');
