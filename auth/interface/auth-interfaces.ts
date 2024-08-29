import { sessionDocument } from "../../utils/schema/session-schema";
import { userDocument } from "../../utils/schema/user-schema";

export interface iRegister {
    username: string;
    mail: string;
    password: string;
    repeatPassword: string;
}

export interface iPayload {
    session: sessionDocument;
}