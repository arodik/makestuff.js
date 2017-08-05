import GeneratorShell from "./shell";
import * as path from "path";
import * as fs from "fs";
import FsExtension from "../extensions/fs";

const dirWithTests = path.resolve(__dirname, "../../test-files"),
    testWorkingDir = dirWithTests,
    absoluteDir = "/tmp/makestuff",
    testComponentPath = "components/TestComponent",
    simpleTemplate = "export default class <%= data.name.default %> {}",
    compiledSimpleTemplate = "export default class TestComponent {}",
    templatesRootPath = "./templates";

function getAbsPathTo(destination: string): string {
    return path.resolve(absoluteDir, destination);
}

describe("shell", function () {
    let generator: GeneratorShell;

    beforeEach(function () {
        generator = new GeneratorShell();
    });

    afterEach(function () {
        FsExtension.deleteFolderRecursive(dirWithTests);
        FsExtension.deleteFolderRecursive(absoluteDir);
    });

    test("can create empty files with proper names", function () {
        const testCommandPath = getAbsPathTo("test/TestComponent"),
            testFiles = [
                "index.test",
                {outputName: "testFile.test"},
                {outputName: (data) => `raw.${data.name.raw}.test`},
                {outputName: (data) => `cc.${data.name.camelCase}.test`},
                {outputName: (data) => `pc.${data.name.pascalCase}.test`},
                {outputName: (data) => `kc.${data.name.kebabCase}.test`},
                {outputName: (data) => `tc.${data.name.trainCase}.test`},
                {outputName: (data) => `sc.${data.name.snakeCase}.test`},
                {outputName: (data) => `dc.${data.name.dotCase}.test`},
            ];

        generator.setupGenerator({
            name: "component",
            outputFiles: testFiles
        });

        const result = generator.run(testWorkingDir, "component", testCommandPath);

        expect(result.created.length).toBe(testFiles.length);
        expect(result.errors.length).toBe(0);

        result.created.forEach(function (filePath) {
            expect(fs.existsSync(filePath)).toBeTruthy();
        });

        const properFilenames = [
            "index.test",
            "testFile.test",
            "raw.TestComponent.test",
            "cc.testComponent.test",
            "pc.TestComponent.test",
            "kc.test-component.test",
            "tc.Test-Component.test",
            "sc.test_component.test",
            "dc.test.component.test",
        ];

        properFilenames.forEach(function (fileName) {
            const pathToFile = path.resolve(testCommandPath, fileName);
            expect(fs.existsSync(pathToFile)).toBeTruthy();
        });
    });

    test("can create files using template specified by absolute path", function () {
        const absolutePathFile = {
                outputName: "absolute.test",
                templatePath: getAbsPathTo("absolute-test.tpl")
            };

        FsExtension.writeFile(absolutePathFile.templatePath, simpleTemplate);

        generator.setupGenerator({
            name: "component",
            templatesRoot: templatesRootPath,
            outputFiles: [absolutePathFile]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);
        const resultFileContent = fs.readFileSync(result.created[0], "UTF-8");

        expect(resultFileContent).toBe(compiledSimpleTemplate);
    });

    test("can create files using template specified by relative path", function () {
        const relativePathFile = {
                outputName: "relative.test",
                templatePath: "./absolute-test.tpl"
            };

        const properPathToTemplate = path.resolve(testWorkingDir, templatesRootPath, relativePathFile.templatePath);
        FsExtension.writeFile(properPathToTemplate, simpleTemplate);

        generator.setupGenerator({
            name: "component",
            templatesRoot: templatesRootPath,
            outputFiles: [relativePathFile]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);

        const pathToCreatedFiles = path.resolve(dirWithTests, testComponentPath);
        const resultFileContent = fs.readFileSync(result.created[0], "UTF-8");

        expect(resultFileContent).toBe(compiledSimpleTemplate);
    });

    test("can create files using template as string", function () {
        const fileFromStringTemplate = {
            outputName: "from-string-template.test",
            template: simpleTemplate
        };

        generator.setupGenerator({
            name: "component",
            outputFiles: [fileFromStringTemplate]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);
        const resultFileContent = fs.readFileSync(result.created[0], "UTF-8");

        expect(resultFileContent).toBe(compiledSimpleTemplate);
    });

    test("must throw the error if template file doesn't exists", function () {
        generator.setupGenerator({
            name: "component",
            outputFiles: [
                {
                    outputName: "absolute.test",
                    templatePath: getAbsPathTo("non-existing-template.tpl")
                }
            ]
        });

        // TODO: throw the typed error
        expect(function() {
            const result = generator.run(dirWithTests, "component", testComponentPath);
        }).toThrowError();
    });

    test("can get additional template variables from config file", function () {
        const testContent = "111";

        generator.setupGenerator({
            name: "component",
            templateVars: function (input, predefinedSettings) {
                return {
                    testVar: testContent
                };
            },
            outputFiles: [
                {outputName: "additional-fields.test", template: "<%- custom.testVar %>"},
            ]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);

        expect(result.created.length).toBe(1);

        const content = fs.readFileSync(
            result.created[0],
            "UTF-8"
        );

        expect(content).toBe(testContent);
    });
});
