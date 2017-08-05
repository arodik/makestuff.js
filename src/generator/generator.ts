import * as Path from "path";
import * as fs from "fs";
import * as ejs from "ejs";
import StringExtension from "../extensions/string";
import FileExtension from "../extensions/fs";
import {IOutputFileDescription, IOutputNameData, ISettings} from "./interfaces";
import PathExtension from "../extensions/path";

export type ExecutionResult = {
    created: Array<string>;
    errors: Array<string>;
};

export default class Generator {
    constructor(private config: ISettings) {
    }

    execute(workingDir: string, path: string, options?: Array<string>): ExecutionResult {
        const createDirectory = this.config.createDirectory !== false,
            normalizedPath = PathExtension.trimLeadingSlashes(path),
            pathToEntityDir = Path.dirname(normalizedPath),
            rawEntityName = Path.basename(normalizedPath),
            normalizedEntityName = this.normalizeName(rawEntityName),
            result: ExecutionResult = {
                created: [],
                errors: []
            };

        const filesToCreate = this.normalizeOutputFiles(workingDir, rawEntityName);

        const absoluteEntityDirPath = createDirectory
            ? Path.resolve(workingDir, pathToEntityDir, normalizedEntityName)
            : Path.resolve(workingDir, pathToEntityDir);

        filesToCreate.forEach(function(file) {
            const fullPathToFile = Path.resolve(absoluteEntityDirPath, file.outputName),
                fileContent = file.template || "";

            try {
                FileExtension.writeFile(fullPathToFile, fileContent);
                result.created.push(fullPathToFile);
            } catch (e) {
                result.errors.push(fullPathToFile);
            }
        });

        return result;
    }

    // TODO: rename this func
    private normalizeOutputFiles(workingDir: string, generatorName: string): Array<IOutputFileDescription> {
        const generatorData = this.getGeneratorData(generatorName);

        return this.config.outputFiles.map((file) => {
            if (typeof file === "string") {
                return {
                    outputName: file
                };
            } else if (typeof file === "function") {
                return {
                    outputName: file(generatorData)
                };
            }

            const result = {...file};

            const customData = typeof this.config.templateVars === "function"
                ? this.config.templateVars({}, generatorData)
                : {};

            const templateData = {
                // TODO: rename this key
                data: generatorData,
                custom: customData
            };

            if (typeof file.outputName === "function") {
                result.outputName = file.outputName(generatorData);
            }

            if (file.template) {
                result.template = ejs.render(file.template, templateData);
            } else if (file.templatePath) {
                const pathToTemplate = this.normalizePathToTemplate(workingDir, file.templatePath);
                const rawTpl = fs.readFileSync(pathToTemplate, "UTF-8");

                result.template = ejs.render(rawTpl, templateData);
            }

            return result;
        });
    }

    private normalizePathToTemplate(workingDir: string, templatePath: string): string {
        const firstChar = templatePath[0];

        if (firstChar === "/") {
            // don't use the templatesRoot or the app root if the path is absolute
            return templatePath;
        } else {
            if (this.config.templatesRoot) {
                return Path.resolve(workingDir, this.config.templatesRoot, templatePath);
            } else {
                return Path.resolve(workingDir, templatePath);
            }
        }
    }

    // TODO: rename this func
    private getGeneratorData(name: string): IOutputNameData {
        return {
            name: {
                raw: name,
                default: this.normalizeName(name),
                camelCase: StringExtension.camelCase(name),
                pascalCase: StringExtension.pascalCase(name),
                kebabCase: StringExtension.kebabCase(name),
                trainCase: StringExtension.trainCase(name),
                snakeCase: StringExtension.snakeCase(name),
                dotCase: StringExtension.dotCase(name)
            }
        };
    }

    private normalizeName(name: string): string {
        const namingConvention = this.config.namingConvention
            ? this.config.namingConvention
            : "pascalCase";

        // Call one of string transformation functions
        if (StringExtension[namingConvention]) {
            return StringExtension[namingConvention](name);
        }

        return name;
    }
}
