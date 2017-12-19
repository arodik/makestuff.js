module.exports = [
    {
        name: "component-ng2",
        description: "Generates NG2 component and empty styles file",
        namingConvention: "pascalCase", // default val
        createDirectory: true, // default val,
        templateVars: function(input, predefinedSettings) {
            return {
                testVar: "TESTCONTENT"
            };
        },
        output: [
            {
                templatePath: "./templates/component-ng2.ejs",
                outputName: data => `${data.name.kebabCase}.component.ts`
            },
            {
                // if file contains "optional" field - engine generates it only if user added corresponding flag
                // to the command
                optional: {
                    name: "styles",
                    shortName: "s",
                    description: "include styles file"
                },
                outputName: data => "_styles.scss"
            }
        ]
    }
];
