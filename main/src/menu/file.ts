import { MenuItemConstructorOptions, dialog, BrowserWindow, ipcMain } from 'electron';
import { extractr_atack, extractr_fault } from '../java-tools-wrapper/extractr';
import * as fs from 'fs-extra';

export enum GraphImportType {
    Extracter,
    Dot,
    CausalModel
}

export interface IGraphImportData {
    type: GraphImportType;
    src: string;
}

export const fileMenuTemplate: MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New File',
                click: () => newFile(),
                accelerator: 'Ctrl+N'
            },
            {
                type: "separator"
            },
            {
                label: 'Save',
                accelerator: 'Ctrl+S',
                click: menuHandlerSave
            },
            {
                label: 'Save as',
                accelerator: 'Ctrl+Shift+S',
                click: menuHandlerSaveAs
            },
            {
                type: "separator"
            },
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
                        click: menuHandlerImportDot
                    },
                    {
                        label: 'causal-model',
                        click: menuHandlerImportCausalModel

                    },
                ]
            },
            {
                label: 'Export',
                submenu: [
                    {
                        label: 'dot-file',
                        click: menuHandlerExport('dot')
                    },
                    {
                        label: 'svg',
                        click: menuHandlerExport('svg')
                    }
                ]
            },
            {
                type: "separator"
            },
            {
                label: 'Exit',
                click: () => console.log('exit')
            }
        ]
    }
]

function newFile() {
    BrowserWindow.getFocusedWindow().webContents.send('new-file');
}

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

    const importDate: IGraphImportData = {
        type: GraphImportType.Extracter,
        src: srcString
    }
    BrowserWindow.getFocusedWindow().webContents.send('import', JSON.stringify(importDate))
}

async function menuHandlerFaultConvert() {
    const emftaSrcPath = await openFile({ properties: ['openFile'], filters: [{ name: 'EMFTA', extensions: ['emfta'] }] });
    if (emftaSrcPath === undefined) {
        return;
    }

    const srcString = await extractr_fault(emftaSrcPath);
    const importDate: IGraphImportData = {
        type: GraphImportType.Extracter,
        src: srcString
    }
    BrowserWindow.getFocusedWindow().webContents.send('import', JSON.stringify(importDate))
}

async function menuHandlerImportCausalModel() {
    const modelSrcPath = await openFile({ properties: ['openFile'], filters: [{ name: 'causalmodel', extensions: ['causalmodel'] }] });
    if (modelSrcPath === undefined) {
        return;
    }

    const srcString = await fs.readFile(modelSrcPath);

    const importDate: IGraphImportData = {
        type: GraphImportType.CausalModel,
        src: srcString.toString()
    }
    BrowserWindow.getFocusedWindow().webContents.send('import', JSON.stringify(importDate))
}

async function menuHandlerImportDot() {
    const modelSrcPath = await openFile({ properties: ['openFile'], filters: [{ name: 'dot', extensions: ['dot'] }] });
    if (modelSrcPath === undefined) {
        return;
    }

    const srcString = await fs.readFile(modelSrcPath);

    const importDate: IGraphImportData = {
        type: GraphImportType.Dot,
        src: srcString.toString()
    }
    BrowserWindow.getFocusedWindow().webContents.send('import', JSON.stringify(importDate))
}

function menuHandlerSave() {
    BrowserWindow.getFocusedWindow().webContents.send('save');
}

function menuHandlerSaveAs() {
    BrowserWindow.getFocusedWindow().webContents.send('saveas');
}

function menuHandlerExport(type: string) {
    return () => BrowserWindow.getFocusedWindow().webContents.send('export', type);
}