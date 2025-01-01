declare namespace Express {
    export interface Request {
        test_key: string,
        cookies: {
            cookie_name: string;
        };
    }
}
