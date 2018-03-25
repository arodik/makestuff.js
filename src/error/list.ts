type MakestuffErrorDictionary = Record<string, {code: number, id: string}>;

export const MakestuffErrors: MakestuffErrorDictionary = {
    cantFindConfig: {code: 1, id: "cantFindConfig"},
    invalidConfigValueError: {code: 2, id: "invalidConfigValueError"},
    wrongGeneratorNameError: {code: 3, id: "wrongGeneratorNameError"},
    incorrectMakestuffVersion: {code: 4, id: "incorrectMakestuffVersion"},
    unknownError: {code: 100, id: "unknownError"}
};
