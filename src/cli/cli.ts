import {IMakestuffConfig} from "../generator/interfaces";
import GeneratorShell from "../shell/shell";

export default class MakestuffCli {
    private shell: GeneratorShell;

    constructor(private workdir: string, private config: IMakestuffConfig) {
        this.setupShell(this.config);
    }

    run(cliEngine: any) {
        this.setupCli(cliEngine);
        cliEngine.parse(process.argv);
    }

    private setupShell(config: IMakestuffConfig) {
        this.shell = new GeneratorShell();

        config.commands.forEach((generatorConfig) => {
            this.shell.setupGenerator(generatorConfig);
        });
    }

    private setupCli(cliEngine: any) {
        this.shell.generators.forEach((generator) => {
            const config = generator.config;
            const cliCommand = cliEngine.command(config.name, config.description)
                .argument("<path>", "Path to generated entity with name in the end");

            config.optionalOutput.forEach((fileDescription) => {
                if (fileDescription.optionName) {
                    cliCommand.option(
                        fileDescription.optionName,
                        fileDescription.optionDescription,
                        cliEngine.BOOL
                    );
                }
            });

            cliCommand.action((args: Record<string, string>, options: Record<string, any>, logger: any) => {
                logger.debug(`Workdir: ${this.workdir}`);

                const optionsList = this.getEnabledBooleanOptions(options);
                const result = this.shell.run(this.workdir, config.name, args.path, optionsList);

                console.warn(result);
            });
        });
    }

    private getEnabledBooleanOptions(options: Record<string, any>): Array<string> {
        return Object.keys(options).filter((option) => {
            return options[option] === true;
        });
    }
}
