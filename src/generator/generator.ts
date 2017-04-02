import * as Path from "path";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import StringExtension from "../extensions/string";

export default class Generator implements Makestuff.IGenerator {
    constructor(private config: Makestuff.IGeneratorSettings) {
    }

    execute(path: string, options?: Array<string>, root?: string): Makestuff.IGeneratorResult {
        const rootPath = root ? root : process.cwd(),
            entityName = this.normalizeName(Path.basename(path)),
            entityDirPath = Path.dirname(path),
            absoluteEntityDirPath = Path.resolve(rootPath, entityDirPath);

        mkdirp.sync(absoluteEntityDirPath);

        // get full path to folder with generated items (root + path), use process.cwd() as default root
        // create folders recursively if it's needed (by path)
        // generate files inside created directory



        return {
            created: [],
            errors: []
        }
    }

    private normalizeName(name: string) {
        const namingConvention = this.config.namingConvention
            ? this.config.namingConvention
            : "camelCase";

        // Call one of string transformation functions
        if (StringExtension[namingConvention]) {
            return StringExtension[namingConvention](name);
        }

        return name;
    }
}
