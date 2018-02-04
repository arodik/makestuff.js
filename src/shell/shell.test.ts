import GeneratorShell from "./shell";
import * as path from "path";
import * as fs from "fs";
import FsExtension from "../extensions/fs";
import {IGeneratorCallbackData} from "../generator/interfaces";

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
        const testCommandPath = "test/TestComponent",
            testFiles = [
                "index.test",
                {name: "testFile.test"},
                {name: (data: IGeneratorCallbackData) => `raw.${data.name.raw}.test`},
                {name: (data: IGeneratorCallbackData) => `cc.${data.name.camelCase}.test`},
                {name: (data: IGeneratorCallbackData) => `pc.${data.name.pascalCase}.test`},
                {name: (data: IGeneratorCallbackData) => `kc.${data.name.kebabCase}.test`},
                {name: (data: IGeneratorCallbackData) => `tc.${data.name.trainCase}.test`},
                {name: (data: IGeneratorCallbackData) => `sc.${data.name.snakeCase}.test`},
                {name: (data: IGeneratorCallbackData) => `dc.${data.name.dotCase}.test`},
            ];

        generator.setupGenerator({
            name: "component",
            output: testFiles
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
            const pathToFile = path.resolve(testWorkingDir, testCommandPath, fileName);
            expect(fs.existsSync(pathToFile)).toBeTruthy();
        });
    });

    test("can create files using template specified by absolute path", function () {
        const absolutePathFile = {
            name: "absolute.test",
            templatePath: getAbsPathTo("absolute-test.tpl")
        };

        FsExtension.writeFile(absolutePathFile.templatePath, simpleTemplate);

        generator.setupGenerator({
            name: "component",
            templatesRoot: templatesRootPath,
            output: [absolutePathFile]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);
        const resultFileContent = fs.readFileSync(result.created[0], "UTF-8");

        expect(resultFileContent).toBe(compiledSimpleTemplate);
    });

    test("can create files using template specified by relative path", function () {
        const relativePathFile = {
            name: "relative.test",
            templatePath: "./absolute-test.tpl"
        };

        const properPathToTemplate = path.resolve(testWorkingDir, templatesRootPath, relativePathFile.templatePath);
        FsExtension.writeFile(properPathToTemplate, simpleTemplate);

        generator.setupGenerator({
            name: "component",
            templatesRoot: templatesRootPath,
            output: [relativePathFile]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);

        const pathToCreatedFiles = path.resolve(dirWithTests, testComponentPath);
        const resultFileContent = fs.readFileSync(result.created[0], "UTF-8");

        expect(resultFileContent).toBe(compiledSimpleTemplate);
    });

    test("can create files using template as string", function () {
        const fileFromStringTemplate = {
            name: "from-string-template.test",
            template: simpleTemplate
        };

        generator.setupGenerator({
            name: "component",
            output: [fileFromStringTemplate]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);
        const resultFileContent = fs.readFileSync(result.created[0], "UTF-8");

        expect(resultFileContent).toBe(compiledSimpleTemplate);
    });

    test("must throw the error if template file doesn't exists", function () {
        generator.setupGenerator({
            name: "component",
            output: [
                {
                    name: "absolute.test",
                    templatePath: getAbsPathTo("non-existing-template.tpl")
                }
            ]
        });

        // TODO: throw the typed error
        expect(function () {
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
            output: [
                {name: "additional-fields.test", template: "<%- custom.testVar %>"},
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

    test("template has access to options", function() {
        const templateWithCustomVar = "<%-data.options.myTestOption ? 'custom-detected' : 'custom-not-detected'%>";
        const compiledTemplate = "custom-detected";

        const fileFromStringTemplate = {
            name: "from-string-template.test",
            template: templateWithCustomVar
        };

        generator.setupGenerator({
            name: "component",
            output: [fileFromStringTemplate]
        });

        const result = generator.run(
            testWorkingDir,
            "component",
            testComponentPath,
            ["myTestOption"]
        );
        const resultFileContent = fs.readFileSync(result.created[0], "UTF-8");

        expect(resultFileContent).toBe(compiledTemplate);
    });
});
