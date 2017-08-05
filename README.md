# makestuff.js
Tiny scaffolding tool for your project

[![Build Status](https://travis-ci.org/arodik/makestuff.js.svg?branch=master)](https://travis-ci.org/arodik/makestuff.js)
[![bitHound Overall Score](https://www.bithound.io/github/arodik/makestuff.js/badges/score.svg)](https://www.bithound.io/github/arodik/makestuff.js)

**!! Currently under developing !! Please don't use this until the first release**

----------------

## How to use

```js
// projectRoot/makestuff.js
const componentGenerator = {
   name: "component", // name for your command
   templatesRoot: "./templates", // tells the generator where to find the templates, 
                                 // can be absolute or relative to the appRoot
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
               actions.makeFileFromTemplate("config.tpl", `${data.dashedName}.config.js`);
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
           templatePath: "./templates/component.tpl",
           outputName: data => `${data.dashedName}.component.ts`
       },
       {
           template: "some file content",
           outputName: data => `${data.dashedName}.ts`
       },
       {
           outputName: data => `${data.dashedName}.html` // just create emplty file
       }
   ]
}

module.exports = [
    componentGenerator
];
```
