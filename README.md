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
   description: "Generate the component", // description for CLI help
   namingConvention: "PascalCase", // by default
   createDirectory: true, // by default. Tells the engine to create the folder, name based on naming convention
   // Create some extra data for the command. They will be exposed to the templates inside the object called `custom`
   templateVars: function(input, predefinedVars) {
       return {
           myOwnVar: 123
       };
   },
   // Tells the generator where to put the result files
   output: [
       {
           templatePath: "./templates/component.ejs",
           name: data => `${data.dashedName}.component.ts`
       },
       {
           template: "some file content",
           name: data => `${data.dashedName}.ts`
       },
       {
           name: data => `${data.dashedName}.html` // just create emplty file
       }
   ],
   // Optional files creators accessed via CLI options
   optionalOutput: [
       {
           optionName: "--styles",
           optionDescription: "include styles file",
           name: "_styles.scss"
       }
   ]
}

module.exports = {
    commands: [
        componentGenerator
    ]
};
```
