import { ObjectId, Types } from "mongoose";
import { JWT } from "../../utils/jwt/jwt";
import { sessionDocument, sessionModel } from "../../utils/schema/session-schema";
import { userDocument } from "../../utils/schema/user-schema";

const jwt = new JWT();

export class Session {

    public async createSession(user: userDocument, userAgent: string): Promise<{token: string, refreshToken: string}> {
        const session = new sessionModel({ user: user, userAgent: userAgent});
        await session.save();

        const token = jwt.signToken({session});
        const refreshToken = jwt.signRefreshToken({session});

        console.log(await this.getSession(token));
        return {token, refreshToken};
    }

    public async getSession(token: string): Promise<any> {
        try {
            const {decode} = jwt.verify(token);
            const findSession = decode?.session._id || "";
            console.log(findSession, 'get ss')
            const session = await sessionModel.findOne({_id: findSession});

            return session;
        } catch (e) {
            console.log(e);
            return;
        }
    }

    public async deleteSession(token: string): Promise<undefined | true> {
        const session = await this.getSession(token);

        if(!session) {
            return;
        }

        sessionModel.findOneAndDelete({session});
        return true;
    }

    public async refreshToken(refreshToken: string): Promise<undefined | string> {
        try{
            const {valid, expired, decode} = jwt.verify(refreshToken);
            const findSession = "66d034349a6d9416825f819a"; // valid _id
            const session = await sessionModel.findOne({_id: "66d034349a6d9416825f819a"});
    
            if(!session) {
                return;
            }
            if(!valid || expired) {
                await sessionModel.findOneAndDelete({_id: session._id});
                return;
            }
            if(!session.valid) {
                await sessionModel.findOneAndDelete({_id: session._id});
                return;
            }
    
            return jwt.signToken({session});
        } catch (e) {
            console.log(e);
            return;
        }
    }
}