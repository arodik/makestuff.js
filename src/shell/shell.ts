import Generator, {ExecutionResult} from "../generator/generator";
import {WrongGeneratorNameError} from "./error/wrong-generator-name";
import {IGeneratorConfig} from "../generator/interfaces";
import GeneratorConfig from "../generator/generator-config";

export default class GeneratorShell {
    private generators: Array<Generator> = [];

    setupGenerator(settings: IGeneratorConfig) {
        const strictConfig = new GeneratorConfig(settings);
        this.generators.push(new Generator(strictConfig));
    }

    run(workingDir: string, generatorName: string, path: string, options?: Array<string>): ExecutionResult {
        const generator = this.findGeneratorByName(generatorName);
        if (!generator) {
            throw new WrongGeneratorNameError(`Can't find generator with name ${generatorName}`);
        }

        return generator.execute(workingDir, path, options);
    }

    private findGeneratorByName(id: string): Generator | null {
        const searchResult = this.generators.find(function(generator) {
            return generator.config.name === id;
        });

        return searchResult || null;
    }
}
