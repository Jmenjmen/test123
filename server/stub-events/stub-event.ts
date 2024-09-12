import { Request, Response } from "express";

export class StubEvent {

    async paymentEvent(req: Request, res: Response) {
        res.status(202).send('metric was created');
    }
}