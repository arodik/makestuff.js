# makestuff.js
Tiny scaffolding tool for your project

**!! Currently under developing !! Please dont use this until the first release**

----------------

## Config file example

```js

let MakesuffCLI = require("makestuff");
let cli = new MakesuffCLI();

cli.setupGenerator({
    name: "component", // name for your command
    root: "./app",     // the working directory for command
    // many roots
    // root: [{name: "app", path: "./app", isDefault: true}, {name: "ui-kit", path: "../../ui-kit"}]
    templatesRoot: "./templates", // tells the generator where to find the templates
    namingConvention: "PascalCase", // by default
    flags: { // CLI params for your command
        "-s": {
            description: "generate style",
            alternative: "--style",
            action: function(data, actions) {
                actions.makeFile("_index.scss");
            }
        },
        "-c": {
            description: "generate config",
            alternative: "--config",
            action: function(data, actions) {
                actions.makeFileFromTemplate("./templates/config.tpl", `${data.dashedName}.config.js`);
            }
        }
    },
    // Create some extra data for the command. They will be exposed to the templates
    templateVars: function(input, predefinedSettings) {
        return predefinedSettings;
    },
    // Tells the generator where to put the result files
    outputFiles: [
        {
            template: "./templates/component.tpl",
            outputName: data => `${data.dashedName}.component.ts`
        },
        {
            outputName: data => `${data.dashedName}.html` // just create emplty file
        }
    ]
});

```
