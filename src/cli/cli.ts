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
        this.config.commands.forEach((command) => {
            cliEngine.command(command.name, command.description)
                .argument("<path>", "Path to generated entity with name in the end")
                .action((args: Record<string, string>, options: Object, logger: any) => {
                    logger.debug(`Workdir: ${this.workdir}`);

                    const result = this.shell.run(this.workdir, command.name, args.path);

                    console.warn(result);
                });
        });
    }
}
