import { kafka } from "./kafka-producer";

const consumer = kafka.consumer({
    groupId: 'test-id'
})

export class kafkaConsumer {

    public async kafkaPaymentEventConsume(): Promise<void> {
        console.log('start consuming');
        await consumer.connect();
        await consumer.subscribe({
            topic: 'payment-event-test',
            fromBeginning: true,
        })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(`Kafka consumer. Topic: ${topic}\n
                    Partition: ${partition}\n
                    Message: ${new Date(Number(message.timestamp)).toLocaleDateString('cz-CZ', {
                    month: "short",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                    second: "numeric"
                })}:: ${message.value}`)
            }
        })
    }
}
