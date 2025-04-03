const defaultStatusText = {
    400: 'Bad request',
    403: 'Forbidden',
    404: 'Not found',
    500: 'Internal server error',
};

const err = (status: number, statusText: string) => {
    const response = {
        status,
        // @ts-ignore(7053)
        statusText: statusText ?? defaultStatusText[
            status
        ] ?? 'Error',
    };
    return new Response(null, response);
};

export default err;
