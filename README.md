# makestuff.js
Makestuff is a tiny tool that allows you to create and execute your own simple scaffolding rules for project.
You can automatically create boring boilerplate stuff in your project.

----------------

## Example:
You have an old AngularJS project and you need to create components, modules, routing configs etc, so you need to write a lot of boilerplate code for each file.

Let's try to automate the component generation process!

- Install the library. `npm i -g makestuff`
- In your project root create the file called `makesuff.config.js` with the following content:
```js
module.exports = {
    commands: [
        {
            // name of your CLI command
            name: "ng-component",
            description: "Generates an AngularJS component",
            // create a directory for your component
            createDirectory: true,
            // You can define your own CLI options.
            // You can use this options in your rules to create files conditionally
            options: {
                name: "-s, --styles",
                description: "create an empty styles file",
            },
            // description of output files
            output: [
                {
                    templatePath: "./templates/component.ejs",
                    name: `component.js`
                },
                {
                    // you can specify only file name, in this case Makestuff will create the empty file for you
                    // this is only a small subset of all features, see the detailed description below
                    name: "_styles.scss",
                    // use the option created above to create files conditionally
                    when: (data) => data.command.optionEnabled("styles")
                }
            ]
        }
    ]
};
```
- create the directory called `templates`
- create the file `templates/component.ejs` with the following content:
```ejs
const template = `<b>Hello, world!</b>`;
const dependencies = [];

class <%=name.pascalCase%>Component {
    constructor() {
    }

    $onInit() {
    }

    $onChanges() {
    }

    $onDestroy() {
    }
}

<%=name.pascalCase%>Component.$inject = dependencies;
<%=name.pascalCase%>Component.controller = <%=name.pascalCase%>Component;
<%=name.pascalCase%>Component.template = template;

export <%=name.pascalCase%>Component;
```
- go to your project root and type `makestuff ng-component /path/to/your/project/MyFirstTest` if you want to generate only component with template, or type `makestuff ng-component /path/to/your/project/MyFirstTest --styles` if you want to generate component with the additional scss file
- go to `/path/to/your/project/MyFirstTest` and check the result! Open the `component.js` and you'll see somenting like this:

```js
const template = `<b>Hello, world!</b>`;
const dependencies = [];

class MyFirstTestComponent {
    constructor() {
    }

    $onInit() {
    }

    $onChanges() {
    }

    $onDestroy() {
    }
}

MyFirstTestComponent.$inject = dependencies;
MyFirstTestComponent.controller = MyFirstTestComponent;
MyFirstTestComponent.template = template;
```
- Voilà! Now you don't have to write all this boring shit manually!

## How it works?
TBD

## Extended config example

```js
// projectRoot/makestuff.js
const componentGenerator = {
   name: "component", // name for your command
   description: "Generate the component", // description for CLI help
   namingConvention: "PascalCase", // by default
   createDirectory: true, // by default. Tells the engine to create the folder, name based on naming convention
   // Create some extra variables for the command. They will be exposed to the templates inside the object called `custom`
   templateVars: function(input, predefinedVars) {
       // predefinedVars contains a lot of thigns like name in the different cases etc.
       return {
           myOwnVar: 123
       };
   },
   // You can define your own CLI options.
   // You can use this options in your rules to create files conditionally
   options: {
       name: "-s, --styles",
       description: "create an empty styles file",
   },
   // Tells the generator where to put the result files
   output: [
       {
           templatePath: "./templates/component.ejs",
           // yes, you can use function to generate names.
           // In this case you will have access to predefinedVars (fist parameter)
           name: data => `${data.dashedName}.component.ts`
       },
       {
           template: "some file content",
           name: data => `${data.dashedName}.ts`
       },
       {
           name: data => `${data.dashedName}.html` // just create emplty file
       },
       {
           // you can specify only file name, in this case Makestuff will create the empty file for you
           name: "_styles.scss",
           when: (data) => data.command.optionEnabled("styles")
       }
   ],

}

module.exports = {
    commands: [
        componentGenerator
    ]
};
```
