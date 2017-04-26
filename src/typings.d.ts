declare module "mkdirp";
declare module "rimraf";
declare module "fs-extra";

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
            configured: string;
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

    type namingConventions = "camelCase" | "pascalCase" | "kebabCase" | "trainCase" | "snakeCase" | "dotCase";

    interface IGeneratorSettings {
        name: string;
        root: string | Array<IRootDescription>;
        namingConvention?: namingConventions;
        createDirectory?: boolean;
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
