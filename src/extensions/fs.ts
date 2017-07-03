import * as path from "path";
import * as fs from "fs";
import * as mkdirp from "mkdirp";

export default class FsExtension {

    static writeFile(filePath: string, content = ""): void {
        if (!filePath) {
            return;
        }

        mkdirp.sync(path.dirname(filePath));
        fs.writeFileSync(filePath, content);
    }

    static deleteFolderRecursive(path: string) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                const curPath = `${path}/${file}`;

                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    FsExtension.deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });

            fs.rmdirSync(path);
        }
    };

}
