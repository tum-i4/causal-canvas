import { MenuItemConstructorOptions, dialog, BrowserWindow, ipcMain } from 'electron';
import * as fs from 'fs';
import { extractr } from '../java-tools-wrapper/extractr';

export const fileMenuTemplate: MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Import',
                submenu: [
                    {
                        label: 'atack-tree',
                        click: menuHandlerAtackConvert
                    },
                    {
                        label: 'fault-tree',
                        click: () => console.log('import fault-tree')
                    },
                    {
                        label: 'dot-file',
                        click: () => console.log('import dot-file')
                    },
                    {
                        label: 'causal-model',
                        click: () => console.log('import causal-model')
                    },
                ]
            },
            {
                label: 'Export',
                submenu: [
                    {
                        label: 'dot-file',
                        click: () => console.log('export dot-file')
                    },
                    {
                        label: 'svg',
                        click: () => console.log('export svg')
                    }
                ]
            },
            {
                label: 'Save',
                click: () => console.log('Save')
            },
            {
                label: 'Save as',
                click: () => console.log('Save as')
            },
            {
                label: 'Exit',
                click: () => console.log('Save')
            }
        ]
    }
]

function openFile(properties: Electron.OpenDialogOptions) {
    return new Promise<string | undefined>((resolve, reject) => {
        dialog.showOpenDialog(properties, (paths) => {
            if (paths === undefined) {
                resolve(undefined);
                return;
            }
            resolve(paths[0]);
        })
    })
}

async function menuHandlerAtackConvert() {
    const adtSrcPath = await openFile({ properties: ['openFile'], filters: [{ name: 'ADT', extensions: ['adt'] }] });
    if (adtSrcPath === undefined) {
        return;
    }
    const userSrcPath = await openFile({ properties: ['openFile'], filters: [{ name: 'XML', extensions: ['xml'] }] });
    if (userSrcPath === undefined) {
        return;
    }

    const srcString = await extractr(adtSrcPath, userSrcPath);
    BrowserWindow.getFocusedWindow().webContents.send('import', srcString)
}

function menuHandlerImport() {
    dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }, (paths) => {
        fs.readFile(paths[0], (error, data) => {
            BrowserWindow.getFocusedWindow().webContents.send('import', data.toString())
        });
    })
}

function menuHandlerExport() {
    BrowserWindow.getFocusedWindow().webContents.send('export', 'yolo');
}