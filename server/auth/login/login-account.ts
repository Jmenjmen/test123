import { Request, Response } from "express";
import { userModel } from "../../utils/schema/user-schema";
import { JWT } from "../../utils/jwt/jwt";
import { Session } from "../session/session";

const jwt = new JWT();
const session = new Session();

export class Login {

    async login(req: Request, res: Response) {
        try {
            const {mail, password} = req.body;

            const candidate = await userModel.findOne({mail: mail});
            if(!candidate) {
                return res.status(409).json({response: "user with this mail is not exists"});
            }

            if(!await candidate.comparePassword(password)) {
                return res.status(401).json({response: "passwords is wrong"});
            }

            return res.status(200).json((await session.createSession(candidate, req.headers["user-agent"] || "")));
        }
        catch (e) {
            console.log(e);
            return res.status(505).send('something gone wrong');
        }
    }

    test(req: Request, res: Response) {
        const {valid} = jwt.verify(req.headers.authorization!);
        const one2 = jwt.verify('123');
        res.json({valid, one2})
    }
}