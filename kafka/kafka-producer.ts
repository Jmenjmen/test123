import { Kafka } from "kafkajs";


export const kafka = new Kafka({
    clientId: 'test-id',
    brokers: ['localhost:9092']
})

const producer = kafka.producer({
    allowAutoTopicCreation: false,
});

export class kafkaProducer {

    public async sendPeymentEventMessage(message: string): Promise<void> {
        await producer.connect();
        await producer.send({
            topic: 'payment-event-test',
            messages: [{
                value: message
            }]
        })
        await producer.disconnect();
    }
}