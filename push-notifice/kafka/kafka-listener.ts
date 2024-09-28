import { Kafka, KafkaMessage } from "kafkajs";
import { listeners } from "./kafka-listeners-map";

export const kafka = new Kafka({
    clientId: 'push-notifier',
    brokers: ['192.168.0.203:9092']
})

const consumer = kafka.consumer({
    groupId: 'push-listener'
})

export interface KafkaListener {
    message(message: KafkaMessage): Promise<void>
}

export class KafkaEventListener {

    public async listener() {
        try {
            consumer.connect();
            consumer.subscribe({
                topics: ['payment-event-test', 'payment-canceled-event'],
                fromBeginning: true
            })
            await consumer.run({
                eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                    const listener = listeners.get(topic) ?? [];
                    const calls = listener.map(listen => listen.message(message));
                    Promise.all(calls);
                }
            })
        } catch (e) {
            return;
        }
    }
}