export type NamingConvention = "camelCase" | "pascalCase" | "kebabCase" | "trainCase" | "snakeCase" | "dotCase";

export type RootDescription = {
    name: string;
    path: string;
    default?: boolean;
};

export interface IGeneratorConfig {
    name: string;
    root?: string | Array<RootDescription>;
    description?: string;
    templatesRoot?: string;
    namingConvention?: NamingConvention;
    createDirectory?: boolean;
    flags?: ISettingsFlags;
    // TODO: rename the function name and args
    templateVars?: (input: any, predefinedSettings: Record<string, any>) => Object;
    outputFiles: Array<string | IOutputFileDescription>;
}

export interface IStrictGeneratorConfig extends IGeneratorConfig {
    root: Array<RootDescription>;
    description: string;
    templatesRoot: string;
    namingConvention: NamingConvention;
    createDirectory: boolean;
    flags: ISettingsFlags;
    // TODO: rename the function name and args
    templateVars: (input: any, predefinedSettings: Record<string, any>) => Object;
    outputFiles: Array<IOutputFileDescription>;
}

export interface ISettingsFlags extends Record<string, ISettingsFlag> {
}

export interface ISettingsFlag {
    description: string;
    alternative: string;
    action: (data: any) => void;
}

export interface IOutputFileDescription {
    template?: string;
    templatePath?: string;
    outputName: ((data: IOutputNameData) => string) | string;
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
