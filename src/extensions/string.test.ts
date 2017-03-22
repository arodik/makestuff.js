import StringExtension from "./string";

describe("getWords", function() {
    test("different separator formats", function() {
        const expectedResult = ["test", "test1", "test2"];
        const testSet = [
            "test test1 test2",
            "test.test1.test2",
            "test_test1_test2",
            "test-test1-test2",
            "test test1.test2",
            "test-test1_test2",
            "test_test1.test2"
        ];

        testSet.forEach(function(testString) {
            expect(StringExtension.getWords(testString))
                .toEqual(expectedResult);
        });
    });

    test("different separator formats, first char of each word is uppercased", function() {
        const expectedResult = ["Test", "Test1", "Test2"];
        const testSet = [
            "Test-Test1-Test2",
            "Test.Test1.Test2",
            "Test_Test1_Test2",
            "Test_Test1.Test2",
        ];

        testSet.forEach(function(testString) {
            expect(StringExtension.getWords(testString))
                .toEqual(expectedResult);
        });
    });

    test("uppercase and numbers", function() {
        const testSet = [
            {str:"TestTest1Test2", result: ["Test", "Test1", "Test2"]},
            {str:"Test-Test1Test2", result: ["Test", "Test1", "Test2"]},
            {str:"TestTest1-Test2", result: ["Test", "Test1", "Test2"]}
        ];

        testSet.forEach(function(testCase) {
            expect(StringExtension.getWords(testCase.str))
                .toEqual(testCase.result);
        });
    });
});

describe("string transformations", function() {
    const testString = "Some.test-Sentence_here yeah";

    test("camel case", function() {
        expect(StringExtension.camelCase(testString))
            .toEqual("someTestSentenceHereYeah");
    });

    test("pascal case", function() {
        expect(StringExtension.pascalCase(testString))
            .toEqual("SomeTestSentenceHereYeah");
    });

    test("kebab case", function() {
        expect(StringExtension.kebabCase(testString))
            .toEqual("some-test-sentence-here-yeah");
    });

    test("train case", function() {
        expect(StringExtension.trainCase(testString))
            .toEqual("Some-Test-Sentence-Here-Yeah");
    });

    test("snake case", function() {
        expect(StringExtension.snakeCase(testString))
            .toEqual("some_test_sentence_here_yeah");
    });

    test("dot case", function() {
        expect(StringExtension.dotCase(testString))
            .toEqual("some.test.sentence.here.yeah");
    });
});
