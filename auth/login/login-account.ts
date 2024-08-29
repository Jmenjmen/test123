import { Request, Response } from "express";
import { userModel } from "../../utils/schema/user-schema";
import { JWT } from "../../utils/jwt/jwt";
import { Session } from "../session/session";

const jwt = new JWT();
const session = new Session();

export class Login {

    async login(req: Request, res: Response): Promise<undefined> {
        try {
            const {mail, password} = req.body;

            const candidate = await userModel.findOne({mail: mail});
            if(!candidate) {
                res.status(409).json({response: "user with this mail is not exists"})
                return
            }

            const isPasswordValid = await candidate.comparePassword(password);
            if(!isPasswordValid) {
                res.status(401).json({response: "passwords is wrong"})
                return
            }

            const tokens = await session.createSession(candidate, req.headers["user-agent"] || "");
            res.status(200).json(tokens);
        }
        catch (e) {
            console.log(e);
        }
    }

    test(req: Request, res: Response) {
        const {valid} = jwt.verify(req.headers.authorization!);
        const one2 = jwt.verify('123');
        res.json({valid, one2})
    }
}