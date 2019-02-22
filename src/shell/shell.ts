import Generator, {ExecutionResult} from "../generator/generator";
import {IGeneratorConfig, IMakestuffConfig} from "../generator/interfaces";
import GeneratorConfig from "../generator/generator-config";
import * as Semver from "semver";
import {Exception} from "../error/utils";
import {MakestuffErrors} from "../error/list";

export default class GeneratorShell {
    private _generators: Array<Generator> = [];

    constructor(private config: IMakestuffConfig) {
        this.checkRequiredVersion(config);
        this.setupGenerators();
    }

    private checkRequiredVersion(config: IMakestuffConfig) {
        const packageConfig = require("../../package.json");
        const makestuffVersion = packageConfig.version;

        if (config.requireVersion !== void 0) {
            const makestuffVersionIsCorrect = Semver.satisfies(makestuffVersion, config.requireVersion);

            if (!makestuffVersionIsCorrect) {
                throw Exception(
                    MakestuffErrors.incorrectMakestuffVersion.id,
                    "Your Makestuff is too old :( \n"
                     + `Your version is ${makestuffVersion} but you need ${config.requireVersion} \n`
                     + "Execute the following command to update: `npm update -g makestuff`"
                );
            }
        }
    }

    private setupGenerators() {
        this.config.commands.forEach((generatorConfig) => {
            this.setupGenerator(generatorConfig);
        });
    }

    get generators(): Array<Generator> {
        return this._generators;
    }

    setupGenerator(settings: IGeneratorConfig) {
        const strictConfig = new GeneratorConfig(settings);
        this._generators.push(new Generator(strictConfig));
    }

    run(rootDir: string, generatorName: string, path: string, options: Array<string> = []): ExecutionResult {
        const generator = this.findGeneratorByName(generatorName);
        if (!generator) {
            throw Exception(
                MakestuffErrors.wrongGeneratorNameError.id,
                `Can't find generator with name ${generatorName}`
            );
        }

        return generator.execute(rootDir, path, options);
    }

    private findGeneratorByName(id: string): Generator | null {
        const searchResult = this._generators.find(function(generator) {
            return generator.config.name === id;
        });

        return searchResult || null;
    }
}
