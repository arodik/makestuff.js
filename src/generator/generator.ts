import * as Path from "path";
import * as fs from "fs";
import * as ejs from "ejs";
import StringExtension from "../extensions/string";
import FileExtension from "../extensions/fs";
import {IOutputFileDescription, IOutputNameData, ISettings} from "./interfaces";

export type ExecuteResult = {
    created: Array<string>;
    errors: Array<string>;
};

export default class Generator {
    constructor(private config: ISettings) {
    }

    execute(path: string, options?: Array<string>, root?: string): ExecuteResult {
        const rootPath = root ? root : process.cwd(),
            createDirectory = this.config.createDirectory !== false,
            entityDirPath = Path.dirname(path),
            rawName = Path.basename(path),
            entityName = this.normalizeName(rawName),
            filesToCreate = this.normalizeOutputFiles(rawName),
            result: ExecuteResult = {
                created: [],
                errors: []
            };

        const absoluteEntityDirPath = createDirectory
            ? Path.resolve(rootPath, entityDirPath, entityName)
            : Path.resolve(rootPath, entityDirPath);

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

    private normalizeOutputFiles(generatorName: string): Array<IOutputFileDescription> {
        const generatorData = this.getGeneratorData(generatorName);

        return this.config.outputFiles.map(function outputFilesNormalizer(file) {
            if (typeof file === "string") {
                return {
                    outputName: file
                }
            } else if (typeof file === "function") {
                return {
                    outputName: file(generatorData)
                }
            }

            const result = Object.assign({}, file);

            if (typeof file.outputName === "function") {
                result.outputName = file.outputName(generatorData);
            }

            if (file.template) {
                result.template = ejs.render(file.template, {
                    data: generatorData
                });
            } else if (file.templatePath) {
                const rawTpl = fs.readFileSync(file.templatePath, "UTF-8");
                result.template = ejs.render(rawTpl, {
                    data: generatorData
                });
            }

            return result;
        });
    }

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
        }
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
