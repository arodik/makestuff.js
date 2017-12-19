#!/usr/bin/env node
import * as CaporalCli from "caporal";
import * as Chalk from "chalk";
import * as path from "path";
import {IGeneratorConfig} from "../generator/interfaces";
import ErrorCodes from "./error-codes";
import MakestuffCli from "./cli";
import Config from "../extensions/config";

const configPath = Config.locate(process.cwd());

if (configPath) {
    // always use config's directory as a working directory
    const workingDir = path.dirname(configPath);
    const configs = require(configPath) as Array<IGeneratorConfig>;

    const packageInfo = require("../../package.json");
    CaporalCli.version(packageInfo.version);

    const makestuffCli = new MakestuffCli(workingDir, configs);

    makestuffCli.run(CaporalCli);
} else {
    console.error(Chalk.red("Can't find " + Config.fileName + " or package.json that contains information about " +
        "Makestuff config path"));
    process.exit(ErrorCodes.cantFindConfig);
}
