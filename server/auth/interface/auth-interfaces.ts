import { sessionDocument } from "../../utils/schema/session-schema";
import { userDocument } from "../../utils/schema/user-schema";

export interface iPayload {
    session: sessionDocument;
}