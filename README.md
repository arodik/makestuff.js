# makestuff.js
Tiny scaffolding tool for your project

[![Build Status](https://travis-ci.org/arodik/makestuff.js.svg?branch=master)](https://travis-ci.org/arodik/makestuff.js)
[![bitHound Overall Score](https://www.bithound.io/github/arodik/makestuff.js/badges/score.svg)](https://www.bithound.io/github/arodik/makestuff.js)
[![dependencies Status](https://david-dm.org/arodik/makestuff.js/status.svg)](https://david-dm.org/arodik/makestuff.js)
[![devDependencies Status](https://david-dm.org/arodik/makestuff.js/dev-status.svg)](https://david-dm.org/arodik/makestuff.js?type=dev)

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
   templateVars: function(input, predefinedSettings) {
       return {
           myOwnVar: 123
       };
   },
   // Tells the generator where to put the result files
   outputFiles: [
       {
           templatePath: "./templates/component.ejs",
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
