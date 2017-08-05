export default class PathExtension {
    static trimLeadingSlashes(path: string): string {
        return path.replace(/^\/+/, "");
    }
}
