import { Kafka } from "kafkajs";

export interface Product {
    name: string,
    price: string,
    id: string
}

export interface KafkaListener {
    onselled(product: Product): Promise<void>
}

export const kafka = new Kafka({
    clientId: "product-producer",
    brokers: ["localhost:9092"]
});

const producer = kafka.producer();

export class KafkaProduceClass {

    async product(product: Product): Promise<void> {
        try {
            await producer.connect();
            await producer.send({
                topic: 'selled-product-event',
                messages: [{ value: `${product}` }]
            })

            await producer.disconnect();
        } catch (e) {
            console.log(e)
        }
    }
}
