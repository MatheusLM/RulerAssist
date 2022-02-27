const { ipcRenderer, ipcMain } = require('electron');

var elements = ['width', 'widthEquivalent', 'height', 'heightEquivalent', 'rows', 'columns', 'equivalent', 'symmetrical', 'dark', 'rotate'];
var body = document.getElementById('body');
var controlsContainer = document.getElementById('controls');

ipcRenderer.on('initial', (event, initialData) => {
    event.sender.emit('syncElements', elements);
    controlsContainer.style.marginTop = data.window.controls ? 0 : '-56px';
    body.style.filter = data.grid.dark ? 'invert(1)' : '';
});

ipcRenderer.on('updateValues', event => {
    getData();
    for (let i = 0; i < elements.length; i++) {
        let prop = elements[i];
        let value = data['grid'][prop];
        let valueOrChecked = typeof value === 'boolean' ? 'checked' : 'value';
        let element = document.getElementById(prop);
        element[valueOrChecked] = value;
    }
});

ipcRenderer.on('updateControls', (event, data) => {
    controlsContainer.style.marginTop = data.window.controls ? 0 : '-56px';
});

ipcRenderer.on('updateDarkMode', (event, data) => {
    body.style.filter = data.grid.dark ? 'invert(1)' : '';
});

console.log('[Loaded] Elements');
