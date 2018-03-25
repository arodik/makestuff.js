const errorDivider = "*-*ERROR-DIVIDER*-*";

interface ErrorInfo {
    id: string;
    message: string;
}

export function Exception(type: string, message: string): Error {
    return new Error(createErrorString(type, message));
}

function createErrorString(type: string, message: string): string {
    return type + errorDivider + message;
}

export function getErrorInfo(error: string): ErrorInfo {
    const [id, message] = error.split(errorDivider);
    return {
        id,
        message
    };
}
