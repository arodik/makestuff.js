import Generator, {ExecuteResult} from "../generator/generator";
import {ISettings as IGeneratorSettings} from "../generator/interfaces";
import {WrongGeneratorNameError} from "./error/wrong-generator-name";
import {WrongNameConventionError} from "./error/wrong-name-convention";

export default class GeneratorShell {
    private generators: Array<IGeneratorSettings> = [];

    setupGenerator(settings: IGeneratorSettings) {
        this.generators.push(settings);
    }

    run(workingDir: string, generatorName: string, path: string, options?: Array<string>): ExecuteResult {
        const generatorSettings = this.findGeneratorSettingsByName(generatorName);
        if (!generatorSettings) {
            throw new WrongGeneratorNameError(`Can't find generator with name ${generatorName}`);
        }

        if (!this.checkNamingConvention(generatorSettings.namingConvention)) {
            throw new WrongNameConventionError(`Invalid naming convention ${generatorSettings.namingConvention}`);
        }

        const generator = new Generator(generatorSettings);

        return generator.execute(workingDir, path, options);
    }

    private checkNamingConvention(convention?: string): boolean {
        if (convention === undefined) {
            return true;
        }

        const validNamingValues = [
            "camelCase", "pascalCase", "kebabCase", "trainCase", "snakeCase", "dotCase"
        ];

        return validNamingValues.indexOf(convention) !== -1;
    }

    private findGeneratorSettingsByName(id: string): IGeneratorSettings | null {
        const searchResult = this.generators.find(function(generator) {
            return generator.name === id;
        });

        return searchResult || null;
    }
}
