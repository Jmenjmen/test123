import { NextFunction, Request, Response } from "express";
import { JWT } from "../jwt/jwt";

const jwt = new JWT();

export function isAuthorized(req: Request, res: Response, next: NextFunction): undefined {
    const token = req.headers.authorization;

    if(!token || !jwt.verify(token)) {
        res.redirect('/');
        return
    }

    next();
}