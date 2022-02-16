const {ipcRenderer, ipcMain} = require('electron');
import('./markers.js');
import('./shortcuts.js');
const fs = require('fs');

let pathToFile;
let data = {};

function getData(path) {
    data = fs.readFileSync(path, 'utf8');
}

ipcRenderer.on('initial', (event, initialData) => {
    pathToFile = initialData;
    getData(initialData);
    console.log('scripts', data);
});

ipcRenderer.on('sync', (event, data) => {
    getData(initialData);
});

/* ipcRenderer.send('resync', newData); */
