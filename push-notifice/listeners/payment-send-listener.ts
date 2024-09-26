import { KafkaMessage } from "kafkajs";
import { KafkaListener } from "../kafka/kafka-listener";

export class PaymentSendListener implements KafkaListener {

    async message(message: KafkaMessage): Promise<void> {
        console.log(message)
        //do smtng
    }
}