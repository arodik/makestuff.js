import IGeneratorSettings = Makestuff.IGeneratorSettings;
import IGenerator = Makestuff.IGenerator;

const generator = require("./generator/generator");

class MakestuffShell {
    private generators: Array<IGenerator> = [];

    setupGenerator(settings: IGeneratorSettings) {
        this.generators.push(new Generator(settings));
    }

    // example: component, /layout/TestComponent, ui-kit
    run(generator: string, path: string, root?: string) {

    }
}

exports = MakestuffShell;
