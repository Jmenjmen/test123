import { Request, Response } from "express";
import { kafkaProducer } from "../kafka/kafka-producer";

export class StubEvent {

    async paymentEvent(req: Request, res: Response) {
        const KafkaProducer = new kafkaProducer();
        await KafkaProducer.sendPeymentEventMessage('payment-created-event');
        res.status(202).send('metric was created');
    }
}