import GeneratorShell from "./shell";
import * as path from "path";
import * as fs from "fs";
import FsExtension from "../extensions/fs";
import {IGeneratorCallbackData} from "../generator/interfaces";

const dirWithTests = path.resolve(__dirname, "../../test-files"),
    testWorkingDir = dirWithTests,
    absoluteDir = "/tmp/makestuff",
    testComponentPath = "components/TestComponent",
    simpleTemplate = "export default class <%= name.default %> {}",
    compiledSimpleTemplate = "export default class TestComponent {}",
    templatesRootPath = "./templates";

function getAbsPathTo(destination: string): string {
    return path.resolve(absoluteDir, destination);
}

describe("shell", function () {
    afterEach(function () {
        FsExtension.deleteFolderRecursive(dirWithTests);
        FsExtension.deleteFolderRecursive(absoluteDir);
    });

    test("throw error if required version is bigger than actual", function() {
        expect(function() {
            const generator = new GeneratorShell({
                requireVersion: "9999.0.0",
                commands: [{name: "t", output: ["test"]}]
            });
        }).toThrowError();
    });

    test("executes before/after hooks correctly", function () {
        const testCommand = {
            name: "component",
            output: ["test"],
            executeBefore: () => {},
            executeAfter: () => {},
        };

        // TODO: how to check that hooks is called with data as a first parameter?
        const executeBeforeHook = spyOn(testCommand, "executeBefore");
        const executeAfterHook = spyOn(testCommand, "executeAfter");

        const generator = new GeneratorShell({
            commands: [testCommand]
        });

        generator.run(testWorkingDir, "component", "test/TestComponent");

        expect(executeBeforeHook).toHaveBeenCalled();
        expect(executeAfterHook).toHaveBeenCalled();
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

        const generator = new GeneratorShell({
            commands: [
                {
                    name: "component",
                    output: testFiles
                }
            ]
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

        const generator = new GeneratorShell({
            commands: [
                {
                    name: "component",
                    templatesRoot: templatesRootPath,
                    output: [absolutePathFile]
                }
            ]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);
        const resultFileContent = fs.readFileSync(result.created[0], "utf-8");

        expect(resultFileContent).toBe(compiledSimpleTemplate);
    });

    test("can create files using template specified by relative path", function () {
        const relativePathFile = {
            name: "relative.test",
            templatePath: "./absolute-test.tpl"
        };

        const properPathToTemplate = path.resolve(testWorkingDir, templatesRootPath, relativePathFile.templatePath);
        FsExtension.writeFile(properPathToTemplate, simpleTemplate);

        const generator = new GeneratorShell({
            commands: [
                {
                    name: "component",
                    templatesRoot: templatesRootPath,
                    output: [relativePathFile]
                }
            ]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);

        const pathToCreatedFiles = path.resolve(dirWithTests, testComponentPath);
        const resultFileContent = fs.readFileSync(result.created[0], "utf-8");

        expect(resultFileContent).toBe(compiledSimpleTemplate);
    });

    test("can create files using template as string", function () {
        const fileFromStringTemplate = {
            name: "from-string-template.test",
            template: simpleTemplate
        };

        const generator = new GeneratorShell({
            commands: [
                {
                    name: "component",
                    output: [fileFromStringTemplate]
                }
            ]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);
        const resultFileContent = fs.readFileSync(result.created[0], "utf-8");

        expect(resultFileContent).toBe(compiledSimpleTemplate);
    });

    test("must throw the error if template file doesn't exists", function () {
        const generator = new GeneratorShell({
            commands: [
                {
                    name: "component",
                    output: [
                        {
                            name: "absolute.test",
                            templatePath: getAbsPathTo("non-existing-template.tpl")
                        }
                    ]
                }
            ]
        });

        expect(function () {
            const result = generator.run(dirWithTests, "component", testComponentPath);
        }).toThrowError();
    });

    test("can get additional template variables from config file", function () {
        const testContent = "111";

        const generator = new GeneratorShell({
            commands: [
                {
                    name: "component",
                    templateVars: function (input, predefinedSettings) {
                        return {
                            testVar: testContent
                        };
                    },
                    output: [
                        {name: "additional-fields.test", template: "<%- custom.testVar %>"},
                    ]
                }
            ]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);

        expect(result.created.length).toBe(1);

        const content = fs.readFileSync(
            result.created[0],
            "utf-8"
        );

        expect(content).toBe(testContent);
    });

    test("template has access to the command's name", function() {
        const commandName = "component";
        const template = "<%- command.name %>";

        const generator = new GeneratorShell({
            commands: [
                {
                    name: commandName,
                    output: [
                        {
                            name: "command-name-test",
                            template
                        },
                    ]
                }
            ]
        });

        const result = generator.run(testWorkingDir, "component", testComponentPath);
        const content = fs.readFileSync(
            result.created[0],
            "utf-8"
        );

        expect(content).toBe(commandName);
    });

    describe("ability to add additional files via options", function() {
        const testContent = "test";

        test("use long and short options", function() {
            const generator = new GeneratorShell({
                commands: [
                    {
                        name: "component",
                        output: [{name: "empty"}],
                        optionalOutput: [
                            {
                                optionName: "-o, --optional",
                                name: "optional",
                                template: testContent
                            },
                            {
                                optionName: "-n --never",
                                name: "never-created"
                            }
                        ]
                    }
                ]
            });

            const result = generator.run(testWorkingDir, "component", testComponentPath, ["optional"]);
            expect(result.created.length).toBe(2);

            const resultFileContent = fs.readFileSync(result.created[1], "utf-8");
            expect(resultFileContent).toBe(testContent);
        });

        test("use only short options", function() {
            const generator = new GeneratorShell({
                commands: [
                    {
                        name: "component",
                        output: [{name: "empty"}],
                        optionalOutput: [
                            {
                                optionName: "-o",
                                name: "optional",
                                template: testContent
                            }
                        ]
                    }
                ]
            });

            const result = generator.run(testWorkingDir, "component", testComponentPath, ["o"]);
            const resultFileContent = fs.readFileSync(result.created[1], "utf-8");
            expect(resultFileContent).toBe(testContent);
        });

        test("`full` option enables all options", function() {
            const generator = new GeneratorShell({
                commands: [
                    {
                        name: "component",
                        output: [{name: "empty"}],
                        optionalOutput: [
                            {optionName: "-o1", name: "optional1"},
                            {optionName: "-o2", name: "optional2"},
                            {optionName: "-o3", name: "optional3"},
                            {optionName: "-o4", name: "optional4"},
                        ]
                    }
                ]
            });

            const expectedCreatedCount = 5;
            const result = generator.run(
                testWorkingDir,
                "component",
                testComponentPath,
                ["full"]
            );
            expect(result.created.length).toBe(expectedCreatedCount);
        });
    });

    test("template has access to options", function() {
        const templateWithCustomOption = "<%-options.myTestOption ? 'custom-detected' : 'custom-not-detected'%>";
        const compiledTemplate = "custom-detected";

        const fileFromStringTemplate = {
            name: "from-string-template.test",
            template: templateWithCustomOption
        };

        const generator = new GeneratorShell({
            commands: [
                {
                    name: "component",
                    output: [fileFromStringTemplate]
                }
            ]
        });

        const result = generator.run(
            testWorkingDir,
            "component",
            testComponentPath,
            ["myTestOption"]
        );
        const resultFileContent = fs.readFileSync(result.created[0], "utf-8");

        expect(resultFileContent).toBe(compiledTemplate);
    });

    describe("Conditional file creation", function() {
        test("calls predicate when creates files", function() {
            const testPredicate = jest.fn();
            testPredicate.mockReturnValue(true);

            const generator = new GeneratorShell({
                commands: [
                    {
                        name: "test",
                        output: [{
                            name: "empty",
                            when: testPredicate
                        }],
                    }
                ]
            });

            generator.run(testWorkingDir, "test", testComponentPath);

            expect(testPredicate).toHaveBeenCalled();
        });

        test("creates additional file if predicate returns true", function () {
            const generator = new GeneratorShell({
                commands: [
                    {
                        name: "test",
                        output: [
                            {
                                name: "empty",
                            },
                            {
                                name: "empty1",
                                when: () => true,
                            }
                        ],
                    }
                ]
            });

            const result = generator.run(testWorkingDir, "test", testComponentPath);

            expect(result.created.length).toBe(2);
        });

        test("skips file creation if predicate returns false", function () {
            const generator = new GeneratorShell({
                commands: [
                    {
                        name: "test",
                        output: [
                            {
                                name: "empty",
                            },
                            {
                                name: "empty1",
                                when: () => false,
                            }
                        ],
                    }
                ]
            });

            const result = generator.run(testWorkingDir, "test", testComponentPath);

            expect(result.created.length).toBe(1);
        });
    });
});
