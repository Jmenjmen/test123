import { KafkaMessage } from "kafkajs";
import { KafkaListener } from "../kafka/kafka-listener";
import { Metric } from "metrics";

export class PaymentCancelListener implements KafkaListener {

    constructor(private metricsClass: Metric) {}

    async message(message: KafkaMessage): Promise<void> {
        this.metricsClass.ObserveTypeHistogram('Payment-cancel');
    }
}