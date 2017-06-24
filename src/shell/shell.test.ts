import GeneratorShell from "./shell";
import * as path from "path";
import * as fs from "fs";
import FsExtension from "../extensions/fs";

const testDir = path.resolve(__dirname, "../test-files");

describe("shell", function() {
    let generator: GeneratorShell;

    beforeEach(function() {
        generator = new GeneratorShell();
    });

    test("can create empty files with proper names", function() {
        const testComponentPath = "/tmp/makestuff/test/TestComponent",
            testFiles = [
                "index.test",
                { outputName: "testFile.test" },
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

        // TODO: make file names check
    });

    test("can create files by template", function() {
        const testComponentPath = "components/TestComponent",
            testTemplate = "export default class <%= data.name.default %> {}",
            expectedTemplate = "export default class TestComponent {}",
            textTemplateFile =  { outputName: "text-template.test", template: testTemplate },
            absolutePathFile = { outputName: "absolute.test", templatePath: "/tmp/makestuff/absolute-test.tpl" };

        FsExtension.writeFile(absolutePathFile.templatePath, testTemplate);

        generator.setupGenerator({
            name: "component",
            root: testDir,
            outputFiles: [
                textTemplateFile,
                absolutePathFile,
                // TODO: make test for relative path template (relative to the config file)
            ]
        });

        const result = generator.run("component", testComponentPath, [], testDir);

        const pathToCreatedFiles = path.resolve(testDir, testComponentPath);
        const textTemplateFileContent = fs.readFileSync(
            path.resolve(pathToCreatedFiles, textTemplateFile.outputName),
            "UTF-8"
        );
        const absolutePathFileContent = fs.readFileSync(
            path.resolve(pathToCreatedFiles, textTemplateFile.outputName),
            "UTF-8"
        );

        expect(textTemplateFileContent).toBe(expectedTemplate);
        expect(absolutePathFileContent).toBe(expectedTemplate);
    });

    test("must throw the error if template file doesn't exists", function() {

    });

    test("can get additional template variables from config file", function() {

    });
});
