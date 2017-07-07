import * as Path from "path";
import * as Fs from "fs";
import * as mkdirp from "mkdirp";

export default class FsExtension {

    static writeFile(filePath: string, content = ""): void {
        if (!filePath) {
            return;
        }

        mkdirp.sync(Path.dirname(filePath));
        Fs.writeFileSync(filePath, content);
    }

    static deleteFolderRecursive(path: string) {
        if (Fs.existsSync(path)) {
            Fs.readdirSync(path).forEach(function (file, index) {
                const curPath = `${path}/${file}`;

                if (Fs.lstatSync(curPath).isDirectory()) { // recurse
                    FsExtension.deleteFolderRecursive(curPath);
                } else { // delete file
                    Fs.unlinkSync(curPath);
                }
            });

            Fs.rmdirSync(path);
        }
    }

}
