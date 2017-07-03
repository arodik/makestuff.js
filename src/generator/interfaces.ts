export type namingConventions = "camelCase" | "pascalCase" | "kebabCase" | "trainCase" | "snakeCase" | "dotCase";

export interface ISettings {
    name: string;
    root?: string;
    templatesRoot?: string;
    namingConvention?: namingConventions;
    createDirectory?: boolean;
    flags?: ISettingsFlags;
    // TODO: rename the function name and args
    templateVars?: (input: any, predefinedSettings: Record<string, any>) => Object;
    outputFiles: Array<string | IOutputFileDescription>
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
