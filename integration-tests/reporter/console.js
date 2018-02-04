const ConsoleReporter = require("../../dist/reporter/console-reporter").ConsoleReporter;

class ConsoleLogger {
    debug(str = "") { console.log(`DEBUG: ${str}`); }
    info(str = "") { console.info(str); }
    log(str = "") { console.log(str); }
    warn(str = "") { console.warn(str); }
    error(str = "") { console.error(str); }
}

const logger = new ConsoleLogger();
const reporter = new ConsoleReporter(logger);

function printDelimiter(heading = "") {
    logger.log(`${heading} =============================`);
    logger.log();
}


printDelimiter("Success");
reporter.printGeneratorResult({
    created: [
        "/Users/tester/app/components/hello-makestuff/component.ts",
        "/Users/tester/app/components/hello-makestuff/template.html",
        "/Users/tester/app/components/hello-makestuff/_index.scss",
        "/Users/tester/app/components/hello-makestuff/index.ts"
    ],
    errors: []
});

printDelimiter("Error");
reporter.printGeneratorResult({
    created: [],
    errors: [
        "/Users/tester/app/components/hello-makestuff/component.ts",
        "/Users/tester/app/components/hello-makestuff/template.html",
        "/Users/tester/app/components/hello-makestuff/_index.scss",
        "/Users/tester/app/components/hello-makestuff/index.ts"
    ]
});

printDelimiter("Mixed result");
reporter.printGeneratorResult({
    created: [
        "/Users/tester/app/components/hello-makestuff/component.ts",
        "/Users/tester/app/components/hello-makestuff/template.html",
        "/Users/tester/app/components/hello-makestuff/_index.scss",
        "/Users/tester/app/components/hello-makestuff/index.ts"
    ],
    errors: [
        "/Users/tester/app/components/hello-makestuff1/component.ts",
        "/Users/tester/app/components/hello-makestuff1/template.html",
        "/Users/tester/app/components/hello-makestuff1/_index.scss",
        "/Users/tester/app/components/hello-makestuff1/index.ts"
    ]
});

printDelimiter("Empty result");
reporter.printGeneratorResult({
    created: [],
    errors: []
});
