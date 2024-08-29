import { ObjectId, Types } from "mongoose";
import { JWT } from "../../utils/jwt/jwt";
import { sessionDocument, sessionModel } from "../../utils/schema/session-schema";
import { userDocument } from "../../utils/schema/user-schema";

const jwt = new JWT();

export class Session {

    public async createSession(user: userDocument, userAgent: string): Promise<{token: string, refreshToken: string}> {
        const session = new sessionModel({ user: user, userAgent: userAgent});
        await session.save();

        return {token: jwt.signToken({ session }), refreshToken: jwt.signRefreshToken({ session })};
    }

    public async getSession(token: string): Promise<sessionDocument | undefined> {
        try {
            const {decode} = jwt.verify(token);

            return await sessionModel.findOne({ _id: decode?.session._id || "" }) as sessionDocument;
        } catch (e) {
            console.log(e);
            return;
        }
    }

    public async deleteSession(token: string): Promise<undefined | true> {
        const session = await this.getSession(token);
        if(!session) return;

        await sessionModel.findOneAndDelete({session});
        return true;
    }

    public async refreshToken(refreshToken: string): Promise<undefined | string> {
        try{
            const {valid, expired, decode} = jwt.verify(refreshToken);
            const session = await sessionModel.findOne({_id: decode?.session._id || ""});
    
            if(!session) return;
            if(!await this.isTokenValidAndNotExpired(valid, expired, session)) return;
            if(!await this.isSessionValid(session)) return;
    
            return jwt.signToken({session});
        } catch (e) {
            console.log(e);
            return;
        }
    }

    private async isTokenValidAndNotExpired(isValid: boolean, isExpired: boolean, session: sessionDocument): Promise<boolean> {
        if(!isValid || isExpired) {
            await sessionModel.findOneAndDelete({_id: session._id});
            return false;
        }
        return true;
    }

    private async isSessionValid(session: sessionDocument): Promise<boolean> {
        if(!session.valid) {
            await sessionModel.findOneAndDelete({_id: session._id});
            return false;
        }
        return true;
    }
}