module.exports = [
    {
        name: "component-ng2",
        description: "Generates NG2 component and empty styles file",
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
