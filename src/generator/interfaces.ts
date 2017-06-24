export type namingConventions = "camelCase" | "pascalCase" | "kebabCase" | "trainCase" | "snakeCase" | "dotCase";

export interface ISettings {
    name: string;
    root: string | Array<ISettingsRootDescription>;
    namingConvention?: namingConventions;
    createDirectory?: boolean;
    flags?: ISettingsFlags;
    templateVars?: (input: any, predefinedSettings: any) => Object;
    outputFiles: Array<string | IOutputFileDescription>
}

export interface ISettingsRootDescription {
    name: string;
    path: string;
    isDefault?: boolean;
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
    outputName: ((data: IOutputNameData) => string) | string
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
    }
}
