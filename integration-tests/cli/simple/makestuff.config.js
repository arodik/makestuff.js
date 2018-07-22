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
                },
                {
                    name: "_test_.test",
                    when: (data) => data.command.optionEnabled("test")
                }
            ],
            options: [
                {
                    name: "-t, --test",
                    description: "Test option",
                }
            ]
        }
    ]
};
