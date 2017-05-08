export class MakestuffError {
    constructor(protected name: string) {
        Error.call(this);
        Error.captureStackTrace(this);
    }

    toString(): string {
        return `Makestuff error: ${this.name}`;
    }
}
