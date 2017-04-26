import Generator from "./generator/generator";
import {IResult, ISettings as IGeneratorSettings} from "./generator/interfaces";

export enum ERROR_CODES {
    generatorDoesntExist = 1,
    invalidNamingConvention,
}

export default class GeneratorShell {
    private generators: Array<IGeneratorSettings> = [];

    setupGenerator(settings: IGeneratorSettings) {
        this.generators.push(settings);
    }

    run(generatorName: string, path: string, options?: Array<string>, projectRoot?: string): IResult | number {
        const generatorSettings = this.findGeneratorSettingsByName(generatorName);
        if (!generatorSettings) {
            console.log(`Can't find generator with name ${generatorName}`);
            return ERROR_CODES.generatorDoesntExist;
        }

        if (!this.checkNamingConvention(generatorSettings.namingConvention)) {
            console.log(`Invalid naming convention ${generatorSettings.namingConvention}`);
            return ERROR_CODES.invalidNamingConvention;
        }

        const generator = new Generator(generatorSettings);

        return generator.execute(path, options, projectRoot);
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
