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
        ]
    }
]

function menuHandlerOpenDevTool() {
    BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
}

function openSettings() {
    BrowserWindow.getFocusedWindow().webContents.send('settings');
}