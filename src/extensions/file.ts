import * as path from "path";
import * as fs from "fs";
import * as mkdirp from "mkdirp";

export default class FileExtension {

    static writeFile(filePath: string, content = ""): void {
        if (!filePath) {
            return;
        }

        mkdirp.sync(path.dirname(filePath));
        fs.writeFileSync(filePath, content);
    }

}
