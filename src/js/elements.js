const { ipcRenderer, ipcMain } = require('electron');
const fs = require('fs');

var elements = ['width', 'widthEquivalent', 'height', 'heightEquivalent', 'rows', 'columns', 'equivalent', 'symmetrical', 'dark', 'rotate'];

ipcRenderer.on('initial', (event, initialData) => {
    getData();
    for (let i = 0; i < elements.length; i++) {
        let prop = elements[i];
        let value = data['grid'][prop];
        let valueOrChecked = typeof value === 'boolean' ? 'checked' : 'value';
        let element = document.getElementById(prop);
        element[valueOrChecked] = value;
    }
    event.sender.emit('syncElements', elements);
});

console.log('[Loaded] Elements');
