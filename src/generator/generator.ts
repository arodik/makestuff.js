import * as Path from "path";
import StringExtension from "../extensions/string";
import FileExtension from "../extensions/file";
import IOutputNameGeneratorData = Makestuff.IOutputNameGeneratorData;
import IOutputFileDescription = Makestuff.IOutputFileDescription;
import * as mkdirp from "mkdirp";

export default class Generator implements Makestuff.IGenerator {
    constructor(private config: Makestuff.IGeneratorSettings) {
    }

    execute(path: string, options?: Array<string>, root?: string): Makestuff.IGeneratorResult {
        const rootPath = root ? root : process.cwd(),
            createDirectory = this.config.createDirectory !== false,
            entityDirPath = Path.dirname(path),
            rawName = Path.basename(path),
            entityName = this.normalizeName(rawName),
            absoluteEntityDirPath = createDirectory
                ? Path.resolve(rootPath, entityDirPath, entityName)
                : Path.resolve(rootPath, entityDirPath);

            return this.createFiles(absoluteEntityDirPath, rawName);
    }

    private createFiles(pathTo: string, rawName: string): Makestuff.IGeneratorResult {
        const filesToCreate = this.normalizeOutputFiles(rawName);
        const result: Makestuff.IGeneratorResult = {
            created: [],
            errors: []
        };

        filesToCreate.forEach(function(file) {
            const fullPathToFile = Path.resolve(pathTo, file.outputName);

            try {
                FileExtension.writeFile(fullPathToFile);
                result.created.push(fullPathToFile);
            } catch (e) {
                result.errors.push(fullPathToFile);
            }
        });

        return result;
    }

    private normalizeOutputFiles(name: string): Array<IOutputFileDescription> {
        const generatorData = this.getGeneratorData(name);

        return this.config.outputFiles.map(function outputFilesNormalizer(file) {
            if (typeof file === "string") {
                return {
                    outputName: file
                }
            }

            const result = {
                outputName: file.outputName,
                template: file.template
            };

            if (typeof file.outputName === "function") {
                result.outputName = file.outputName(generatorData);
            }

            return result;
        });
    }

    private getGeneratorData(name: string): IOutputNameGeneratorData {
        return {
            name: {
                raw: name,
                configured: this.normalizeName(name),
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
