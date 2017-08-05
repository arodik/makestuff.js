#!/usr/bin/env node
import * as CaporalCli from "caporal";
import FsExtension from "../extensions/fs";
import {ISettings} from "../generator/interfaces";
import ErrorCodes from "./error-codes";
import MakestuffCli from "./cli";

const configFileName = "makestuff.config.js";
const workingDir = process.cwd();
const configPath = FsExtension.locateFileRecursively(configFileName, workingDir);

if (!configPath) {
    console.error(`Can't find ${configFileName}`);
    process.exit(ErrorCodes.cantFindConfig);
}

let configs = require(configPath as string) as Array<ISettings>;

const packageInfo = require("../../package.json");
CaporalCli.version(packageInfo.version);

const makestuffCli = new MakestuffCli(workingDir, configs);

makestuffCli.run(CaporalCli);
