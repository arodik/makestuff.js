export default class StringExtension {

    /**
     *  Get words from
     *  PascalCase, camelCase, kebab-case, Train-Case, snake_case, dot.case
     *  doesn't support abbreviations
     */
    static getWords(target: string): Array<string> {
        let withWhitespaces = target.replace(/([A-Z])/g, " $1");
        if (withWhitespaces[0] === " ") {
            // remove the redundant whitespace
            withWhitespaces = withWhitespaces.slice(1);
        }
        return withWhitespaces.split(/[\s\-._]+/);
    }

    static ucfirst(target: string): string {
        return target.charAt(0).toUpperCase() + target.substr(1);
    }

    static lowercaseSeparate(target: string, separator: string): string {
        return StringExtension.getWords(target)
            .map(element => element.toLowerCase())
            .join(separator);
    }

    static camelCase(target: string): string {
        return StringExtension.getWords(target).reduce(function(buffer, element, index) {
            const isFirstPart = index === 0;
            const namePart = isFirstPart
                ? element.toLowerCase()
                : StringExtension.ucfirst(element.toLowerCase());

            return buffer + namePart;
        }, "");
    }

    static pascalCase(target: string): string {
        return StringExtension.ucfirst(
            StringExtension.camelCase(target)
        )
    }

    static kebabCase(target: string): string {
        return StringExtension.lowercaseSeparate(target, "-");
    }

    static trainCase(target: string): string {
        return StringExtension.getWords(target)
            .map(element => StringExtension.ucfirst(element.toLowerCase()))
            .join("-");
    }

    static snakeCase(target: string): string {
        return StringExtension.lowercaseSeparate(target, "_");
    }

    static dotCase(target: string): string {
        return StringExtension.lowercaseSeparate(target, ".");
    }

}
