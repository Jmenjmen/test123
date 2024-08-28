import { NextFunction, Request, Response } from "express";
import { JWT } from "../jwt/jwt";

const jwt = new JWT();

export function isAuthorized(req: Request, res: Response, next: NextFunction): undefined {
    const token = req.headers.authorization;
    const refreshToken = req.headers['x-refresh'];

    if(!token || !jwt.verify(token)) {
        res.redirect('/');
        return
    }

    if(!refreshToken || !jwt.verify(refreshToken[0])) {
        res.redirect('/');
        return
    }

    

    next();
}