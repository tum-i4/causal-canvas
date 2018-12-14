import { MenuItemConstructorOptions, dialog, BrowserWindow, ipcMain } from 'electron';
import { extractr_atack, extractr_fault } from '../java-tools-wrapper/extractr';
import * as fs from 'fs-extra';
import { setCurrentPath } from '../index';

export enum GraphImportType {
    Extracter,
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
                        click: () => console.log('import causal-model')
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
                click: menuHandlerSave
            },
            {
                label: 'Save as',
                click: menuHandlerSaveAs
            },
            {
                label: 'Exit',
                click: () => console.log('exit')
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
    setCurrentPath(modelSrcPath);
    BrowserWindow.getFocusedWindow().webContents.send('import', JSON.stringify(importDate))
}

function menuHandlerSave() {
    BrowserWindow.getFocusedWindow().webContents.send('save');
}

function menuHandlerSaveAs() {
    BrowserWindow.getFocusedWindow().webContents.send('saveas');
}