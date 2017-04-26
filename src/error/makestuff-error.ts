export class MakestuffError {
    protected name: string;

    constructor(message: string) {
        this.name = message;
        Error.call(this);
        Error.captureStackTrace(this);
    }

    toString(): string {
        return `Makestuff error: ${this.name}`;
    }
}
