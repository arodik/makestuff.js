class StringExtsnsion {

    static getWords(target: string): Array<string> {

    }

    static ucfirst(target: string): string {
        return target.charAt(0).toUpperCase() + target.substr(1);
    }

    static lowercaseSeparate(target: string, separator: string): string {
        return StringExtsnsion.getWords(target)
            .map(element => element.toLowerCase())
            .join(separator);
    }

    static camelCase(target: string): string {
        return StringExtsnsion.getWords(target).reduce(function(buffer, element, index) {
            const isFirstPart = index === 0;
            const namePart = isFirstPart
                ? element.toLowerCase()
                : StringExtsnsion.ucfirst(element.toLowerCase());

            return buffer + namePart;
        }, "");
    }

    static pascalCase(target: string): string {
        return StringExtsnsion.ucfirst(
            StringExtsnsion.camelCase(target)
        )
    }

    static kebabCase(target: string): string {
        return StringExtsnsion.lowercaseSeparate(target, "-");
    }

    static trainCase(target: string): string {
        return StringExtsnsion.getWords(target)
            .map(element => StringExtsnsion.ucfirst(element.toLowerCase()))
            .join("-");
    }

    static snakeCase(target: string): string {
        return StringExtsnsion.lowercaseSeparate(target, "_");
    }

    static dotCase(target: string): string {
        return StringExtsnsion.lowercaseSeparate(target, ".");
    }

}

module.exports = StringExtsnsion;
