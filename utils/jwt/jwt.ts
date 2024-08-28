import { iPayload } from '../../auth/interface/auth-interfaces';
import jwt from "jsonwebtoken";
import { privateKey, publicKey } from '../../var';

export class JWT {

    signToken(payload: iPayload): string {
        return jwt.sign(payload, privateKey, { expiresIn: '10s', algorithm: 'RS256' });
    }

    signRefreshToken(payload: iPayload): string {
        return jwt.sign(payload, privateKey, { expiresIn: '100d', algorithm: 'RS256'  });
    }

    verify(token: string): boolean {
        return !!jwt.verify(token, publicKey, {algorithms: ['RS256']});
    }
}