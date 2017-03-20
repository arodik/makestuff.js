import IGeneratorSettings = Makestuff.IGeneratorSettings;

class MakestuffShell {
    private generators: Array<IGeneratorSettings> = [];

    setupGenerator(settings: IGeneratorSettings) {
        this.generators.push(settings);
    }

    // example: component, /layout/TestComponent, ui-kit
    run(generator: string, path: string, root?: string) {

    }
}

exports = MakestuffShell;
