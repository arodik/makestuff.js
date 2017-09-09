import {IGeneratorConfig} from "../generator/interfaces";
import GeneratorShell from "../shell/shell";

export default class MakestuffCli {
    private shell: GeneratorShell;

    constructor(private workdir: string, private configs: Array<IGeneratorConfig>) {
        this.setupShell(this.configs);
    }

    run(cliEngine: any) {
        this.setupCli(cliEngine);
        cliEngine.parse(process.argv);
    }

    private setupShell(configs: Array<IGeneratorConfig>) {
        this.shell = new GeneratorShell();

        configs.forEach((config) => {
            this.shell.setupGenerator(config);
        });
    }

    private setupCli(cliEngine: any) {
        this.configs.forEach((config) => {
            cliEngine.command(config.name, config.description)
                .argument("<path>", "Path to generated entity with name in the end")
                .action((args: Record<string, string>, options: Object, logger: any) => {
                    logger.debug(`Workdir: ${this.workdir}`);

                    const result = this.shell.run(this.workdir, config.name, args.path);

                    console.warn(result);
                });
        });
    }
}
