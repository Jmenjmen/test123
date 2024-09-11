import { listenersMap } from "./kafka-listeners";
import { kafka } from "./kafka-producer";

const consumer = kafka.consumer({
    groupId: 'test-id'
})

export class kafkaConsumer {

    public async kafkaPaymentEventConsume(): Promise<void> {
        console.log('start consuming');
        await consumer.connect();
        await consumer.subscribe({
            topics: ['payment-event-test', 'payment-canceled-event'],
            fromBeginning: true,
        })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const listeners = listenersMap.get(topic) ?? [];
                const calls = listeners.map(async (listener) => listener.onMessage(message));
                Promise.all(calls);
            }
        })
    }
}
