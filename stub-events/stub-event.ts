import { Request, Response } from "express";
import { Metric } from "../metrics/metrics";

export class StubEvent {

    paymentEvent(req: Request, res: Response) {
        res.status(202).send('metric was created');
    }
}