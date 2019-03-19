import { MenuItemConstructorOptions, app, remote, BrowserWindow } from 'electron';

export const editMenuTemplate: MenuItemConstructorOptions[] = [
    {
        label: 'Edit',
        submenu: [

            {
                label: 'Create Node',
                accelerator: 'Ctrl+Shift+N',
                click: createNode,
            },
            {
                label: 'Delete Node',
                click: deleteNode,
            },
            {
                type: "separator"
            },
            {
                label: 'Toggel Command Input',
                accelerator: 'Ctrl+Shift+P',
                click: openCMD,
            },
            {
                label: 'Toggel Modus',
                click: toggelModus,
            },
        ]
    }
]

function createNode() {
    BrowserWindow.getFocusedWindow().webContents.send('create-node');
}

function deleteNode() {
    BrowserWindow.getFocusedWindow().webContents.send('delete-node');
}

function openCMD() {
    BrowserWindow.getFocusedWindow().webContents.send('open-cmd');
}

function toggelModus() {
    BrowserWindow.getFocusedWindow().webContents.send('toggel-modus');
}