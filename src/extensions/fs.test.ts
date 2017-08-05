import * as path from "path";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import FsExtension from "../extensions/fs";

describe("FS Extension", function() {
    const rootTestDir = "/tmp/makestuff-fs-test";

    afterEach(function() {
        FsExtension.deleteFolderRecursive(rootTestDir);
    });

    describe("deleteFolderRecursive", function() {
        const testDirPath = path.resolve(rootTestDir, "deleteFolderRecursive");

        afterEach(function() {
            FsExtension.deleteFolderRecursive(testDirPath);
        });

        test("can find the file in the start dirctory", function() {
            const fileName = "1.txt";
            const filePath = path.resolve(testDirPath, fileName);
            FsExtension.writeFile(filePath, "--test--");

            const fileLocation = FsExtension.locateFileRecursively(fileName, testDirPath);
            expect(fileLocation).toBe(filePath);
        });

        test("can find the file in t the parent directory", function() {
            const fileName = "2.txt";
            const filePath = path.resolve(testDirPath, "../", fileName);
            FsExtension.writeFile(filePath, "--test--");

            const fileLocation = FsExtension.locateFileRecursively(fileName, testDirPath);
            expect(fileLocation).toBe(filePath);
        });

        test("returns null if can't locate the file", function() {
            const fileLocation = FsExtension.locateFileRecursively("not-existing-file", testDirPath);
            expect(fileLocation).toBeNull();
        });
    });
});
