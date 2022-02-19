const { globalShortcut } = require('electron');

var shortcuts = true;

function setupKeys() {
    globalShortcut.register('Alt+R', () => {
        shortcuts = !shortcuts;
        console.log('[Shortcut]', shortcuts);
    });
    globalShortcut.register('Alt+Q', () => {
        if (!shortcuts) return;
        console.log('[Shortcut] Alt+Q');
    });
}

console.log('[Loaded] Shortcuts');
module.exports = setupKeys;
