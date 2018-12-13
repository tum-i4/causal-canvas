import { exec } from 'child_process';
import * as path from 'path';
import * as os from 'os';

const PATH_TO_JAR = path.join(__dirname, '..', 'java-tools', 'extractr', 'extractr-0.1.jar');

export function extractr(adtSrcPath: string, userSrcPath: string): Promise<string> {
    console.time('extractr');
    return new Promise<string>((resolve, reject) => {
        exec(`java -jar "${PATH_TO_JAR}" "${adtSrcPath}" -u  "${userSrcPath}" -e "${os.tmpdir()}"`, (error, stdout, stderr) => {
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
