module.exports = {
    commands: [
        {
            name: "component-ng2",
            description: "Generates NG2 component and empty styles file",
            namingConvention: "pascalCase", // default val
            createDirectory: true, // default val,
            templateVars: function(input, predefinedVars) {
                return {
                    testVar: "TESTCONTENT"
                };
            },
            output: [
                {
                    templatePath: "./templates/component-ng2.ejs",
                    name: data => `${data.name.kebabCase}.component.ts`
                }
            ],
            optionalOutput: [
                {
                    optionName: "-s, --styles",
                    optionDescription: "include styles file",
                    name: "_styles.scss"
                }
            ]
        }
    ]
};
