#!/usr/bin/env node
import * as Caporal from "caporal";
import * as path from "path";
import MakestuffCli from "./cli";
import Config from "../extensions/config";
import {IMakestuffConfig} from "../generator/interfaces";
import {getErrorInfo} from "../error/utils";
import {MakestuffErrors} from "../error/list";
import {red, bold} from "chalk";

const configPath = Config.locate(process.cwd());

if (configPath) {
    // always use config's directory as a working directory
    const workingDir = path.dirname(configPath);
    const makestuffConfig = require(configPath) as IMakestuffConfig;

    const packageInfo = require("../../package.json");
    Caporal.version(packageInfo.version);

    try {
        const makestuffCli = new MakestuffCli(workingDir, makestuffConfig);
        makestuffCli.run(Caporal);
    } catch (error) {
        const errorInfo = getErrorInfo(error);
        if (errorInfo) {
            console.error(red(errorInfo.message));
            process.exit(errorInfo.code);
        }

        console.error(bold.red(error));
        process.exit(MakestuffErrors.unknownError.code);
    }
} else {
    console.error(red("Can't find " + Config.fileName + " or package.json that contains information about " +
        "Makestuff config path"));
    process.exit(MakestuffErrors.cantFindConfig.code);
}
