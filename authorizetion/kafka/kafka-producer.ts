import { Kafka } from "kafkajs";


export const kafka = new Kafka({
    clientId: 'test-id',
    brokers: ['192.168.0.203:9092']
})

const producer = kafka.producer();

export class kafkaProducer {

    public async sendPeymentCreatedEventMessage(message: string): Promise<void> {
        try {
            await producer.connect();
            await producer.send({
                topic: 'payment-event-test',
                messages: [{
                    value: message
                }]
            })
            await producer.disconnect();
        } catch (e) {
            return;
        }
    }

    public async sendPeymentCanceledEventMessage(message: string): Promise<void> {
        try {
            await producer.connect();
            await producer.send({
                topic: 'payment-canceled-event',
                messages: [{
                    value: message
                }]
            })
            await producer.disconnect();
        }
        catch (e) {
            return;
        }
    }
}