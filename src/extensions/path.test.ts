import PathExtension from "./path";

describe("Path extension", function() {

    describe("trimLeadingSlashes", function() {

        test("should remove all leading slashes from the string", function() {
            expect(PathExtension.trimLeadingSlashes("/a")).toBe("a");
            expect(PathExtension.trimLeadingSlashes("///a")).toBe("a");
        });

        test("shouldn't remove the slashes from the end", function() {
            expect(PathExtension.trimLeadingSlashes("/a/")).toBe("a/");
        });

        test("shouldn't modify the string if it doesn't contains the leading slashes", function() {
            expect(PathExtension.trimLeadingSlashes("a/")).toBe("a/");
        });
    });

});
