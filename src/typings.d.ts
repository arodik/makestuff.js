declare namespace Makestuff {
    interface IRootDescription {
        name: string;
        path: string;
        isDefault?: boolean;
    }

    interface IGeneratorFlags {
        [key: string]: {
            description: string;
            alternative: string;
            action: (data: any) => void;
        }
    }

    interface IOutputFileDescription {
        template: string;
        outputName: ((data: any) => string) | string
    }

    interface IGeneratorSettings {
        name: string;
        root: string | Array<IRootDescription>;
        namingConvention?: string;
        flags: IGeneratorFlags;
        templateVars: (input: any, predefinedSettings: any) => Object;
        outputFiles: Array<string | IOutputFileDescription>
    }

    interface IGenerator {
        execute(): IGeneratorResult;
    }

    interface IGeneratorResult {
        filesCreated: Array<string>;
        errors: Array<string>;
    }
}
