const { ipcRenderer, ipcMain } = require('electron');
const fs = require('fs');

let elements = import('./elements.js');
import('./listeners.js');
import('./shortcuts.js');
import('./markers.js');

let pathToFile;
let data = {};

function getData() {
    data = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
}
function setData() {
    fs.writeFileSync(pathToFile, JSON.stringify(data));
}

ipcRenderer.on('initial', (event, initialData) => {
    pathToFile = initialData;
    getData();
});

ipcRenderer.on('sync', (event, data) => {
    getData();
});

/* ipcRenderer.send('resync', newData); */
