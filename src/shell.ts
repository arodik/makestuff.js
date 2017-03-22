import IGeneratorSettings = Makestuff.IGeneratorSettings;
import Generator from "./generator/generator";

export default class GeneratorShell {
    private generators: Array<IGeneratorSettings> = [];

    setupGenerator(settings: IGeneratorSettings) {
        this.generators.push(settings);
    }

    // example: component, /layout/TestComponent, ui-kit
    run(generatorName: string, path: string, root?: string) {
        const generatorSettings = this.findGeneratorSettingsByName(generatorName);
        if (!generatorSettings) {
            console.log(`Can't find generator with name ${generatorName}`);
            return;
        }

        const generator = new Generator(generatorSettings);
        const result = generator.execute(path, root);

        console.log("Generated", result);
    }

    private findGeneratorSettingsByName(id: string): IGeneratorSettings | null {
        const searchResult = this.generators.find(function(generator) {
            return generator.name === id;
        });

        return searchResult || null;
    }
}
