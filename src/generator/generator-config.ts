import {
    IGeneratorConfig, IOutputFileDescription, ISettingsFlags, IStrictGeneratorConfig, NamingConvention, RootDescription
} from "./interfaces";
import {Prop} from "../decorators";
import {InvalidConfigValueError} from "./error/invalid-config-value";

export default class GeneratorConfig implements IStrictGeneratorConfig {
    private props: IStrictGeneratorConfig;

    @Prop() name: string;
    // @Prop() root: Array<RootDescription>;
    @Prop() description: string;
    @Prop() templatesRoot: string;
    @Prop() namingConvention: NamingConvention;
    @Prop() createDirectory: boolean;
    @Prop() flags: ISettingsFlags;
    @Prop() templateVars: (input: any, predefinedSettings: Record<string, any>) => Object;
    @Prop() outputFiles: Array<IOutputFileDescription>;

    constructor(private originalUserConfig: IGeneratorConfig) {
        this.validateConfig(originalUserConfig);
        this.props = this.normalizeConfig(originalUserConfig);
    }

    private validateConfig(config: IGeneratorConfig) {
        if (!config.name) {
            throw new InvalidConfigValueError("Name for generator is not specified");
        }

        // Naming convention might be empty, it'll be initialized later by default value
        if (config.namingConvention !== void 0) {
            if (!this.checkNamingConvention(config.namingConvention)) {
                throw new InvalidConfigValueError(`Invalid naming convention ${config.namingConvention}`);
            }
        }

        if (Array.isArray(config.outputFiles)) {
            if (!config.outputFiles.length) {
                throw new InvalidConfigValueError("You must specify at least one output file");
            }
        }
    }

    private checkNamingConvention(convention: NamingConvention): boolean {
        const validNamingValues = [
            "camelCase", "pascalCase", "kebabCase", "trainCase", "snakeCase", "dotCase"
        ];

        return validNamingValues.indexOf(convention) !== -1;
    }

    private normalizeConfig(config: IGeneratorConfig): IStrictGeneratorConfig {
        const normalizedConfig = {...config};

        normalizedConfig.description = config.description || "";
        normalizedConfig.templatesRoot = config.templatesRoot || "./";
        normalizedConfig.namingConvention = config.namingConvention || "pascalCase";
        normalizedConfig.createDirectory = config.createDirectory || true;
        normalizedConfig.flags = config.flags || {};
        normalizedConfig.templateVars = config.templateVars || function(input, predefinedSettings) {
            return {};
        };

        if (!Array.isArray(config.outputFiles)) {
            normalizedConfig.outputFiles = [];
        }

        return normalizedConfig as IStrictGeneratorConfig;
    }
}
