import { KafkaListener, KafkaProduceClass, Product } from "../producer/kafka-producer";
import { Metric } from "metrics";


export class SelledProductsListener implements KafkaListener {

    constructor(private metrics: Metric, private kafkaProducer: KafkaProduceClass) {}

    async onselled(product: Product): Promise<void> {
        const { name, id , price } = product;
        this.metrics.ObserveSelledProducts(name, price, id);
        await this.kafkaProducer.product(product);
    }
}