import GeneratorShell from "./shell";
import * as path from "path";
import * as fsExtra from "fs-extra";

const testDir = path.resolve(__dirname, "../test");

function cleanTestDir() {
    fsExtra.removeSync(testDir);
}

describe("shell", function() {
    let generator: Makestuff.IGeneratorShell;

    beforeEach(function() {
        cleanTestDir();
        generator = new GeneratorShell();
    });

    afterAll(cleanTestDir);

    test("can create empty files with proper names", function() {
        generator.setupGenerator({
            name: "component",
            outputFiles: [
                "index.test",
                { outputName: (data) => `${data.name.raw}.test` },
                { outputName: (data) => `${data.name.camelCase}.test` },
                { outputName: (data) => `${data.name.pascalCase}.test` },
                { outputName: (data) => `${data.name.kebabCase}.test` },
                { outputName: (data) => `${data.name.trainCase}.test` },
                { outputName: (data) => `${data.name.snakeCase}.test` },
                { outputName: (data) => `${data.name.dotCase}.test` },
            ]
        });

        const result = generator.run("component", "components/TestComponent", {}, testDir);

        expect(result).toBe(0);
    });
});
