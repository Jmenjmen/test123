import { KafkaMessage } from "kafkajs";
import { Metric } from "metrics";
import { KafkaListener } from "../kafka/kafka-listener";

export class PaymentSendListener implements KafkaListener {

    constructor(private metricsClass: Metric) {}

    async message(message: KafkaMessage): Promise<void> {
        this.metricsClass.ObserveTypeHistogram('Payment-send');
    }
}