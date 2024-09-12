import { NextFunction, Request, Response } from "express";
import { JWT } from "../jwt/jwt";
import { Session } from "../../auth/session/session";

const jwt = new JWT();
const sessionClass = new Session();

export async function isTokenValid(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    const refreshToken = req.headers['x-refresh'] as string;


    if(!token) {
        return next();
    }
    if(!refreshToken) {
        return next();
    }

    const {decode} = jwt.verify(token);
    if(decode) {
        return next();
    }

    const newToken = await sessionClass.refreshToken(refreshToken);
    if(newToken) {
        res.setHeader('x-access-token', newToken);
        res.locals.newToken = newToken;
        return next();
    }
    
    next();
}