export class MakestuffError {
    name: string;

    constructor(message: string) {
        Error.call(this);
        Error.captureStackTrace(this);
        this.name = message;
    }
}
