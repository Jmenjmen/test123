import { iPayload } from '../../auth/interface/auth-interfaces';
import jwt, { JwtPayload } from "jsonwebtoken";
import { privateKey, publicKey } from '../../var';
import { sessionDocument } from '../schema/session-schema';

export interface verifySession {
    valid: boolean;
    expired: boolean;
    decode: iPayload | null;
}

export class JWT {

    signToken(payload: iPayload): string {
        return jwt.sign(payload, privateKey, { expiresIn: '30s', algorithm: 'RS256' });
    }

    signRefreshToken(payload: iPayload): string {
        return jwt.sign(payload, privateKey, { expiresIn: '100d', algorithm: 'RS256' });
    }

    verifyBool(token: string): boolean {
        return !!jwt.verify(token, publicKey, {algorithms: ['RS256']});
    }

    verify(token: string): verifySession {
        try {
            const decode = jwt.verify(token, publicKey, {algorithms: ['RS256']}) as iPayload;
            return {
                valid: true,
                expired: false,
                decode
            }
        } catch (e) {
            return {
                valid: false,
                expired: true,
                decode: null
            }
        }
    }
}