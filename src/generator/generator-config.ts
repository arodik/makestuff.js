import {
    IGeneratorCallback,
    IGeneratorConfig, INormalizedOption, INormalizedOutputFile, ISettingsFlags, IStrictGeneratorConfig, NamingConvention
} from "./interfaces";
import {Prop} from "../decorators";
import {Exception} from "../error/utils";
import {MakestuffErrors} from "../error/list";

export default class GeneratorConfig implements IStrictGeneratorConfig {
    private props: IStrictGeneratorConfig;

    @Prop() name: string;
    @Prop() description: string;
    @Prop() templatesRoot: string;
    @Prop() namingConvention: NamingConvention;
    @Prop() createDirectory: boolean;
    @Prop() flags: ISettingsFlags;
    @Prop() templateVars: (input: any, predefinedSettings: Record<string, any>) => Object;
    @Prop() output: Array<INormalizedOutputFile>;
    @Prop() options: Array<INormalizedOption>;
    @Prop() executeBefore: IGeneratorCallback;
    @Prop() executeAfter: IGeneratorCallback;

    /**
     * @deprecated
     */
    @Prop() optionalOutput: Array<INormalizedOutputFile>;

    constructor(private originalUserConfig: IGeneratorConfig) {
        this.validateConfig(originalUserConfig);
        this.props = this.normalizeConfig(originalUserConfig);
    }

    private validateConfig(config: IGeneratorConfig) {
        if (!config.name) {
            throw Exception(
                MakestuffErrors.invalidConfigValueError.id,
                "Name for generator is not specified"
            );
        }

        // Naming convention might be empty, it'll be initialized later by default value
        if (config.namingConvention !== void 0) {
            if (!this.checkNamingConvention(config.namingConvention)) {
                throw Exception(
                    MakestuffErrors.invalidConfigValueError.id,
                    `Invalid naming convention ${config.namingConvention}`
                );
            }
        }

        if (Array.isArray(config.output)) {
            if (!config.output.length) {
                throw Exception(
                    MakestuffErrors.invalidConfigValueError.id,
                    "You must specify at least one output file"
                );
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
        const normalizedConfig = {...config} as IStrictGeneratorConfig;

        normalizedConfig.description = config.description || "";
        normalizedConfig.templatesRoot = config.templatesRoot || "./";
        normalizedConfig.namingConvention = config.namingConvention || "pascalCase";
        normalizedConfig.createDirectory = config.createDirectory !== false;
        normalizedConfig.flags = config.flags || {};
        normalizedConfig.templateVars = config.templateVars || function(input, predefinedSettings) {
            return {};
        };

        if (!Array.isArray(normalizedConfig.output)) {
            normalizedConfig.output = [];
        }

        if (Array.isArray(normalizedConfig.options)) {
            normalizedConfig.options.forEach((option) => {
                option.description = option.description || "";
            });
        } else {
            normalizedConfig.options = [];
        }

        if (!Array.isArray(normalizedConfig.optionalOutput)) {
            normalizedConfig.optionalOutput = [];
        }

        if (typeof normalizedConfig.executeBefore !== "function") {
            normalizedConfig.executeBefore = function () {
            };
        }

        if (typeof normalizedConfig.executeAfter !== "function") {
            normalizedConfig.executeAfter = function () {
            };
        }

        return normalizedConfig;
    }
}
