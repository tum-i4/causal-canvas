import { MenuItemConstructorOptions, app, remote, BrowserWindow } from 'electron';

export const helpMenuTemplate: MenuItemConstructorOptions[] = [
    {
        label: 'Help',
        submenu: [

            {
                label: 'Settings',
                click: openSettings,
            }, {
                label: 'Open Dev Tools',
                click: menuHandlerOpenDevTool,
            },
            {
                type: "separator"
            },
            {
                label: 'Open example',
                click: showExample,
            },
        ]
    }
]

function menuHandlerOpenDevTool() {
    BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
}

function openSettings() {
    BrowserWindow.getFocusedWindow().webContents.send('settings');
}

function showExample() {
    BrowserWindow.getFocusedWindow().webContents.send('showExample');
}