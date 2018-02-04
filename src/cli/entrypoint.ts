#!/usr/bin/env node
import Caporal from "caporal";
import * as Chalk from "chalk";
import * as path from "path";
import ErrorCodes from "./error-codes";
import MakestuffCli from "./cli";
import Config from "../extensions/config";
import {IMakestuffConfig} from "../generator/interfaces";

const configPath = Config.locate(process.cwd());

if (configPath) {
    // always use config's directory as a working directory
    const workingDir = path.dirname(configPath);
    const makestuffConfig = require(configPath) as IMakestuffConfig;

    const packageInfo = require("../../package.json");
    Caporal.version(packageInfo.version);

    const makestuffCli = new MakestuffCli(workingDir, makestuffConfig);

    makestuffCli.run(Caporal);
} else {
    console.error(Chalk.red("Can't find " + Config.fileName + " or package.json that contains information about " +
        "Makestuff config path"));
    process.exit(ErrorCodes.cantFindConfig);
}
