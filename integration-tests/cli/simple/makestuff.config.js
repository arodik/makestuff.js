module.exports = {
    commands: [
        {
            name: "component",
            description: "Generates component and empty styles file",
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
            options: [
                {
                    name: "-t, --test",
                    description: "Test option (does nothing)",
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
