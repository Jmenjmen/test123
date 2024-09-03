import { NextFunction, Request, Response } from "express";
import { Session } from "../../auth/session/session";
import { sessionDocument } from '../schema/session-schema';

const sessionClass = new Session();

export async function isAuthorized(req: Request, res: Response, next: NextFunction) {
    const token = res.locals.newToken || req.headers.authorization;// When you finish you have to remove access with newToken

    if(!token) {
        return res.redirect('/');
    }

    const session = await sessionClass.getSession(token);
    if(!session) {
        return res.redirect('/');
    }

    res.locals.user = session as sessionDocument;
    next();
}