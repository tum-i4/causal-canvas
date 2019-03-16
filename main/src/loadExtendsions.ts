import * as fs from "fs-extra";
import * as path from 'path';
import { app } from 'electron'

interface LayoutExtension {
    name: string;
    desciption: string;
    algorithm: (input: any) => any;
}


export async function loadeExtensions(): Promise<LayoutExtension[]> {
    const dirPath = path.join(app.getPath('desktop'), 'causal-canvas', 'extensions', 'layout')

    const existsDir = await fs.pathExists(dirPath);
    if (!existsDir) {
        return [];
    }

    const extendsionsPaths = await fs.readdir(dirPath);
    const extensions = [];
    for (const p of extendsionsPaths) {
        const exPath = path.join(dirPath, p);
        const extension = await fs.readFile(exPath)
        extensions.push(eval(extension.toString()));
    }

    return extensions;
}