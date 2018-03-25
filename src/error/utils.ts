import {MakestuffErrors} from "./list";

const errorDivider = "*-*ERROR-DIVIDER*-*";

interface ErrorInfo {
    id: string;
    code: number;
    message: string;
}

export function Exception(type: string, message: string): Error {
    return new Error(createErrorString(type, message));
}

function createErrorString(type: string, message: string): string {
    return type + errorDivider + message;
}

export function getErrorInfo(error: string): ErrorInfo | null {
    if (error) {
        const [id, message] = error.split(errorDivider);

        const makestuffError = MakestuffErrors[id];
        if (makestuffError) {
            return {
                id,
                message,
                code: makestuffError.code
            };
        }
    }

    return null;
}
