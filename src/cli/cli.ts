import Generator from "../generator/generator";
import {IMakestuffConfig, INormalizedOption, INormalizedOutputFile} from "../generator/interfaces";
import GeneratorShell from "../shell/shell";
import {ConsoleReporter} from "../reporter/console-reporter";

export default class MakestuffCli {
    private shell: GeneratorShell;

    constructor(private workdir: string, private config: IMakestuffConfig) {
        this.shell = new GeneratorShell(this.config);
    }

    run(cliEngine: Caporal) {
        this.setupCli(cliEngine);
        cliEngine.parse(process.argv);
    }

    private setupCli(cliEngine: Caporal) {
        this.shell.generators.forEach((generator) => {
            this.setupGenerator(generator, cliEngine);
        });
    }

    private setupGenerator(generator: Generator, cliEngine: Caporal) {
        const config = generator.config;
        const cliCommand = cliEngine.command(config.name, config.description)
            .argument("<path>", "Path to generated entity with name in the end (example: src/app/myTest)");

        this.registerOutputOptions(config.optionalOutput, cliCommand, cliEngine);
        this.registerOptions(config.options, cliCommand, cliEngine);

        cliCommand.action((args: Record<string, string>, options: Record<string, any>, logger: Logger) => {
            const reporter = new ConsoleReporter(logger);
            logger.debug(`Workdir: ${this.workdir}`);

            const optionsList = this.getEnabledBooleanOptions(options);
            const result = this.shell.run(this.workdir, config.name, args.path, optionsList);

            reporter.printGeneratorResult(result);
        });

        this.registerFullOption(cliCommand, cliEngine);
    }

    private registerOptions(options: Array<INormalizedOption>, cliCommand: Command, cliEngine: Caporal) {
        options.forEach((option) => {
            cliCommand.option(option.name, option.description, cliEngine.BOOL);
        });
    }

    /**
     * @deprecated
     */
    private registerOutputOptions(
        outputFiles: Array<INormalizedOutputFile>,
        cliCommand: Command,
        cliEngine: Caporal
    ) {
        const uniqOptions = new Set();

        if (outputFiles.length) {
            console.warn("WARN: optionalOutput directive is deprecated. It'll be removed soon. Use `options` instead.");
        }

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

    // add option that enables all other options
    private registerFullOption(cliCommand: Command, cliEngine: Caporal) {
        cliCommand.option("--full", "Enable all options", cliEngine.BOOL);
    }

    private getEnabledBooleanOptions(options: Record<string, any>): Array<string> {
        const enabledOptions = Object.keys(options).filter((option) => {
            return options[option] === true;
        });

        const uniqOptions = Array.from(new Set(enabledOptions));

        return uniqOptions;
    }
}
