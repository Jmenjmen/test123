import { JWT } from "../../utils/jwt/jwt";
import { sessionModel } from "../../utils/schema/session-schema";
import { userDocument } from "../../utils/schema/user-schema";

const jwt = new JWT();

export class Session {

    createSession(user: userDocument, userAgent: string): {token: string, refreshToken: string} {
        const session = new sessionModel({ user: user, userAgent: userAgent})

        const token = jwt.signToken({ user, session });
        const refreshToken = jwt.signRefreshToken({ user, session });

        return {token, refreshToken};
    }

    refreshToken(token: string) {

    }
}