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

    static locateFileRecursively(fileName: string, startPath: string): string | null {
        // Search for file in the startPath
        const fullPath = Path.resolve(startPath, fileName);
        if (Fs.existsSync(fullPath)) {
            return fullPath;
        }

        // If we can't find the file - Get parent folder and try to search again
        const parentPath = Path.dirname(startPath);
        if (startPath === parentPath) {
            return null; // We've reached the root and haven't found the file
        }

        return FsExtension.locateFileRecursively(fileName, parentPath);
    }

}
