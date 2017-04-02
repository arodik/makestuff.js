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

    interface IOutputNameGeneratorData {
        name: {
            raw: string;
            camelCase: string;
            pascalCase: string;
            kebabCase: string;
            trainCase: string;
            snakeCase: string;
            dotCase: string;
        }
    }

    interface IOutputFileDescription {
        template?: string;
        outputName: ((data: IOutputNameGeneratorData) => string) | string
    }

    interface IGeneratorSettings {
        name: string;
        root: string | Array<IRootDescription>;
        namingConvention?: "camelCase" | "pascalCase" | "kebabCase" | "trainCase" | "snakeCase" | "dotCase";
        flags?: IGeneratorFlags;
        templateVars?: (input: any, predefinedSettings: any) => Object;
        outputFiles: Array<string | IOutputFileDescription>
    }

    interface IGenerator {
        execute(path: string, options?: Array<string>, root?: string): IGeneratorResult;
    }

    interface IGeneratorResult {
        created: Array<string>;
        errors: Array<string>;
    }

    interface IGeneratorShell {
        setupGenerator(settings: IGeneratorSettings): void;
        run(generatorName: string, path: string, options?: Array<string>, projectRoot?: string): number;
    }
}

declare module mkdirp {}
