import {ExecutionResult} from "../generator/generator";
import chalk from "chalk";

export class ConsoleReporter {
    constructor(private logger: Logger) {
    }

    printGeneratorResult(result: ExecutionResult) {
        if (result.errors.length && result.created.length) {
            this.printMixedResult(result);
        } else if (result.errors.length) {
            this.printErrorResult(result);
        } else if (result.created.length) {
            this.printSuccessResult(result);
        } else {
            this.printEmptyResult();
        }
        this.printEmptyLine();
    }

    private printSuccessResult(result: ExecutionResult, heading?: string) {
        const defaultSuccessHeading = "Success! The following files were created:";

        this.logger.info(chalk.bold.underline.green(heading || defaultSuccessHeading));
        result.created.forEach((filePath) => {
            this.logger.info(chalk.yellow(filePath));
        });
    }

    private printErrorResult(result: ExecutionResult, heading?: string) {
        const defaultErrorTitle = "An error occured. The following files were not created:";

        this.logger.info(chalk.bold.underline.red(heading || defaultErrorTitle));
        result.errors.forEach((filePath) => {
            this.logger.info(chalk.red(filePath));
        });
    }

    private printMixedResult(result: ExecutionResult) {
        const successHeader = "The following files were created:";
        const errorHeader = "The following files were not created:";

        this.printSuccessResult(result, successHeader);
        this.printEmptyLine();
        this.printErrorResult(result, errorHeader);
    }

    private printEmptyResult() {
        const emptyResultText = "I haven't created any file, sorry :(";
        const hintText = "Maybe your config doesn't contain rules.\n\n" +
            "Please, create the issue on GitHub " +
            "if you're experiencing problems or you've found a bug";
        const githubIssuesLink = "https://github.com/arodik/makestuff.js/issues";

        this.logger.info(chalk.bold.yellow(emptyResultText));
        this.logger.info(chalk.bold.yellow(hintText));
        this.logger.info(chalk.underline.bold.blue(githubIssuesLink));
    }

    private printEmptyLine() {
        this.logger.log("");
    }
}
