import {MakestuffErrors} from "./list";

interface CustomError extends Error {
    type: string;
}

interface ErrorInfo {
    type: string;
    code: number;
    message: string;
}

export function Exception(type: string, message: string): Error {
    const newError = new Error(message) as CustomError;
    newError.type = type;
    return newError;
}

export function getErrorInfo(error: CustomError): ErrorInfo | null {
    if (error.type) {
        const makestuffError = MakestuffErrors[error.type];
        if (makestuffError) {
            return {
                type: error.type,
                message: error.message,
                code: makestuffError.code
            };
        }
    }

    return null;
}
