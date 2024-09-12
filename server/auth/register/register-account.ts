import { Request, Response } from "express";
import { userModel } from "../../utils/schema/user-schema";
import { Session } from "../session/session";

const session = new Session();

export class Register {

    async register(req: Request, res: Response) {
        try {
            const {username, mail, password, repeatPassword} = req.body;

            if(repeatPassword !== password) {
                return res.status(401).json({response: "passwords is wrong"});
            }

            if(await userModel.findOne({ mail: mail })) {
                return res.status(409).json({response: "user with this mail is existing now"});
            }

            const user = new userModel({ username, mail, password });
            await user.save();
            return res.status(200).json((await session.createSession(user, req.headers["user-agent"] || "")));
        }
        catch (e) {
            console.log(e);
            return res.status(505).send('something gone wrong');
        }
    }
}