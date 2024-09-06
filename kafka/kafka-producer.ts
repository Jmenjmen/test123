import { Kafka } from "kafkajs";


export const kafka = new Kafka({
    clientId: 'test-id',
    brokers: ['localhost:9092']
})

const producer = kafka.producer({
    allowAutoTopicCreation: false,
});

export class kafkaProducer {

    public async sendPeymentCreatedEventMessage(message: string): Promise<void> {
        await producer.connect();
        await producer.send({
            topic: 'payment-event-test',
            messages: [{
                value: message
            }]
        })
        await producer.disconnect();
    }

    public async sendPeymentCanceledEventMessage(message: string): Promise<void> {
        await producer.connect();
        await producer.send({
            topic: 'payment-canceled-event',
            messages: [{
                value: message
            }]
        })
        await producer.disconnect();
    }
}