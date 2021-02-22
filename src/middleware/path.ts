import { NextFunction, Request, Response } from 'express';

const path = (src: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        (req as any).templateDir = src;
        next();
    };
};

export default path;
