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
        // options: [
        //     {
        //         name: "styles",
        //         shortName: "s",
        //         description: "include styles file",
        //         execute: function(data, actions) {
        //
        //         }
        //     }
        // ],
        outputFiles: [
            {
                templatePath: "./templates/component-ng2.ejs",
                outputName: data => `${data.name.kebabCase}.component.ts`
            },
            {
                outputName: data => "_styles.scss"
            }
        ]
    }
];
