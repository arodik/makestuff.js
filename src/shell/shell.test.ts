import GeneratorShell from "./shell";
import * as path from "path";
import * as mockFs from "mock-fs";
import * as fs from "fs";
import {IResult} from "../generator/interfaces";

const testDir = path.resolve(__dirname, "../test");

describe("shell", function() {
    let generator: GeneratorShell;

    beforeEach(function() {
        mockFs();
        generator = new GeneratorShell();
    });

    afterEach(mockFs.restore);

    test("can create empty files with proper names", function() {
        const testComponentPath = "components/TestComponent",
            testFiles = [
                "index.test",
                { outputName: (data) => `raw.${data.name.raw}.test` },
                { outputName: (data) => `cc.${data.name.camelCase}.test` },
                { outputName: (data) => `pc.${data.name.pascalCase}.test` },
                { outputName: (data) => `kc.${data.name.kebabCase}.test` },
                { outputName: (data) => `tc.${data.name.trainCase}.test` },
                { outputName: (data) => `sc.${data.name.snakeCase}.test` },
                { outputName: (data) => `dc.${data.name.dotCase}.test` },
            ];

        generator.setupGenerator({
            name: "component",
            root: testDir,
            outputFiles: testFiles
        });

        const result = generator.run("component", testComponentPath, [], testDir);

        expect(result.created.length).toBe(testFiles.length);
        expect(result.errors.length).toBe(0);

        const resultFiles = fs.readdirSync(path.resolve(testDir, testComponentPath));

        expect(resultFiles.length).toBe(testFiles.length);
    });
});
