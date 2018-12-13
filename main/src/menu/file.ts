import { MenuItemConstructorOptions, dialog, BrowserWindow, ipcMain } from 'electron';
import * as fs from 'fs';
import { extractr_atack, extractr_fault } from '../java-tools-wrapper/extractr';

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
                        click: menuHandlerFaultConvert
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

    const srcString = await extractr_atack(adtSrcPath, userSrcPath);
    BrowserWindow.getFocusedWindow().webContents.send('import', srcString)
}

async function menuHandlerFaultConvert() {
    const emftaSrcPath = await openFile({ properties: ['openFile'], filters: [{ name: 'EMFTA', extensions: ['emfta'] }] });
    if (emftaSrcPath === undefined) {
        return;
    }

    const srcString = await extractr_fault(emftaSrcPath);
    BrowserWindow.getFocusedWindow().webContents.send('import', srcString)
}

function menuHandlerExport() {
    BrowserWindow.getFocusedWindow().webContents.send('export', 'yolo');
}