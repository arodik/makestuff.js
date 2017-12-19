import * as Fs from "fs";
import * as Path from "path";
import FsExtension from "./fs";

interface MakestuffJsonConfig {
    makestuff?: {
        configPath?: string;
    };
}

export default class Config {
    static fileName = "makestuff.config.js";

    // Look for configration file
    // try to find makestuff.config.js or package.json with config path
    static locate(workingDirectory: string): string | null {
        // Search for file in the startPath
        const fullPath = Path.resolve(workingDirectory, Config.fileName);
        if (Fs.existsSync(fullPath)) {
            return fullPath;
        }

        // try to get config path from a package.json file
        const packageJsonPath = Path.resolve(workingDirectory, "package.json");
        if (Fs.existsSync(packageJsonPath)) {
            const packageConfig = require(packageJsonPath) as MakestuffJsonConfig;
            const configPath = packageConfig
                && packageConfig.makestuff
                && packageConfig.makestuff.configPath;

            if (configPath) {
                const absoluteConfigPath = Path.resolve(workingDirectory, configPath);
                if (Fs.existsSync(absoluteConfigPath)) {
                    return absoluteConfigPath;
                }
            }
        }

        // If we can't find a config - Get parent folder and try to search again
        const parentPath = Path.dirname(workingDirectory);
        if (workingDirectory === parentPath) {
            return null; // We've reached the root and haven't found any config file :(
        }

        return Config.locate(parentPath);
    }
}
