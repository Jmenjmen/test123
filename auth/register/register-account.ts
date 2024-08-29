import { Request, Response } from "express";
import { userModel } from "../../utils/schema/user-schema";
import { JWT } from "../../utils/jwt/jwt";
import { Session } from "../session/session";

const jwt = new JWT();
const session = new Session();

export class Register {

    async register(req: Request, res: Response): Promise<undefined> {
        try {
            const {username, mail, password, repeatPassword} = req.body;

            if(repeatPassword !== password) {
                res.status(401).json({response: "passwords is wrong"})
                return
            }

            const candidate = await userModel.findOne({mail: mail});
            if(candidate) {
                res.status(409).json({response: "user with this mail is existing now"})
                return
            }

            const user = new userModel({ username, mail, password });
            await user.save();
            const tokens = await session.createSession(user, req.headers["user-agent"] || "");
            res.status(200).json(tokens);
        }
        catch (e) {
            console.log(e);
        }
    }
}