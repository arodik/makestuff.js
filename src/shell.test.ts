import * as mockFs from "mock-fs";
import GeneratorShell from "./shell";

describe("shell", function() {
    let generator: Makestuff.IGeneratorShell;

    beforeEach(function() {
        mockFs();
        generator = new GeneratorShell();
    });
    afterEach(mockFs.restore);

    test("can create empty files with proper names", function() {
        generator.setupGenerator({
            name: "component",
            root: "tests",
            outputFiles: [
                "index.ts",
                { outputName: (data) => `${data.name.raw}.ts` },
                { outputName: (data) => `${data.name.camelCase}.ts` },
                { outputName: (data) => `${data.name.pascalCase}.ts` },
                { outputName: (data) => `${data.name.kebabCase}.ts` },
                { outputName: (data) => `${data.name.trainCase}.ts` },
                { outputName: (data) => `${data.name.snakeCase}.ts` },
                { outputName: (data) => `${data.name.dotCase}.ts` },
            ]
        });

        const result = generator.run("component", "components/TestComponent", {}, process.cwd());

        expect(result).toBe(0);
    });
});
