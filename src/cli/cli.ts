import {IMakestuffConfig, INormalizedOutputFile} from "../generator/interfaces";
import GeneratorShell from "../shell/shell";
import {ConsoleReporter} from "../reporter/console-reporter";

export default class MakestuffCli {
    private shell: GeneratorShell;

    constructor(private workdir: string, private config: IMakestuffConfig) {
        this.setupShell(this.config);
    }

    run(cliEngine: Caporal) {
        this.setupCli(cliEngine);
        cliEngine.parse(process.argv);
    }

    private setupShell(config: IMakestuffConfig) {
        this.shell = new GeneratorShell();

        config.commands.forEach((generatorConfig) => {
            this.shell.setupGenerator(generatorConfig);
        });
    }

    private setupCli(cliEngine: Caporal) {
        this.shell.generators.forEach((generator) => {
            const config = generator.config;
            const cliCommand = cliEngine.command(config.name, config.description)
                .argument("<path>", "Path to generated entity with name in the end");

            this.registerUniqOptions(config.optionalOutput, cliCommand, cliEngine);

            cliCommand.action((args: Record<string, string>, options: Record<string, any>, logger: Logger) => {
                const reporter = new ConsoleReporter(logger);
                logger.debug(`Workdir: ${this.workdir}`);

                const optionsList = this.getEnabledBooleanOptions(options);
                const result = this.shell.run(this.workdir, config.name, args.path, optionsList);

                reporter.printGeneratorResult(result);
            });
        });
    }

    private registerUniqOptions(
        outputFiles: Array<INormalizedOutputFile>,
        cliCommand: Command,
        cliEngine: Caporal
    ) {
        const uniqOptions = new Set();

        outputFiles.forEach((fileDescription) => {
            const optionExists = uniqOptions.has(fileDescription.optionName);

            if (!optionExists) {
                cliCommand.option(
                    fileDescription.optionName,
                    fileDescription.optionDescription,
                    cliEngine.BOOL
                );

                uniqOptions.add(fileDescription.optionName);
            }
        });
    }

    private getEnabledBooleanOptions(options: Record<string, any>): Array<string> {
        const enabledOptions = Object.keys(options).filter((option) => {
            return options[option] === true;
        });

        const uniqOptions = Array.from(new Set(enabledOptions));

        return uniqOptions;
    }
}
