import { NextFunction, Request, Response } from "express";
import { Session } from "../../auth/session/session";
import { sessionDocument } from '../schema/session-schema';

const sessionClass = new Session();

export async function isAuthorized(req: Request, res: Response, next: NextFunction): Promise<undefined> {
    const token = res.locals.newToken || req.headers.authorization;

    if(!token) {
        res.redirect('/');
        return;
    }

    const session = await sessionClass.getSession(token);
    if(!session) {
        res.redirect('/');
        return;
    }

    res.locals.user = session as sessionDocument;
    next();
}