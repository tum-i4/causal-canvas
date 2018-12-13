import { exec } from 'child_process';
import * as path from 'path';
import * as os from 'os';

const PATH_TO_JAR = path.join(__dirname, '..', 'java-tools', 'extractr', 'extractr-0.1.jar');

export async function extractr_atack(adtSrcPath: string, userSrcPath: string) {

    const args = `"${adtSrcPath}" -u "${userSrcPath}"`
    return extractr(args);
    //`java -jar "${PATH_TO_JAR}" "${adtSrcPath}" -u "${userSrcPath}" -e "${os.tmpdir()}"`
}

export async function extractr_fault(emftaSrcPath: string) {
    const args = `"${emftaSrcPath}"`
    return extractr(args);
}

function extractr(args: string): Promise<string> {
    console.time('extractr');
    return new Promise<string>((resolve, reject) => {
        exec(`java -jar "${PATH_TO_JAR}" ${args}`, (error, stdout, stderr) => {
            if (error !== null) {
                console.log(error);
                reject(error);

                return;
            }
            console.timeEnd('extractr');
            console.log(stdout);
            resolve(stdout);
        })
    });

}
