export type NamingConvention = "camelCase" | "pascalCase" | "kebabCase" | "trainCase" | "snakeCase" | "dotCase";

export interface IMakestuffConfig {
    commands: Array<IGeneratorConfig>;
}

export interface IOutputFile {
    optionName: string;
    optionDescription?: string;
    template?: string;
    templatePath?: string;
    name: ((data: IOutputNameData) => string) | string;
}

export type TOutputFile = string | IOutputFile;

export interface INormalizedOutputFile {
    template: string;
    name: string;
    optionName: string;
    optionDescription: string;
}

export interface IGeneratorConfig {
    name: string;
    description?: string;
    templatesRoot?: string;
    namingConvention?: NamingConvention;
    createDirectory?: boolean;
    flags?: ISettingsFlags;
    templateVars?: (input: any, predefinedSettings: Record<string, any>) => Object;
    output: Array<TOutputFile>;
    optionalOutput?: Array<IOutputFile>;
}

export interface IStrictGeneratorConfig extends IGeneratorConfig {
    description: string;
    templatesRoot: string;
    namingConvention: NamingConvention;
    createDirectory: boolean;
    flags: ISettingsFlags;
    templateVars: (input: any, predefinedSettings: Record<string, any>) => Object;
    output: Array<INormalizedOutputFile>;
    optionalOutput: Array<INormalizedOutputFile>;
}

export interface ISettingsFlags extends Record<string, ISettingsFlag> {
}

export interface ISettingsFlag {
    description: string;
    alternative: string;
    action: (data: any) => void;
}

export interface IOutputNameData {
    name: {
        raw: string;
        default: string;
        camelCase: string;
        pascalCase: string;
        kebabCase: string;
        trainCase: string;
        snakeCase: string;
        dotCase: string;
    };
}
