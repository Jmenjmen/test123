import { KafkaMessage } from "kafkajs";
import { KafkaListener } from "./payment-create-listener";

export class PaymentCanceledListener implements KafkaListener {

    async onMessage(message: KafkaMessage): Promise<void> {
        console.log('payment canceled listener is working', message.value?.toString());
        console.log(`
            Message: ${new Date(Number(message.timestamp)).toLocaleDateString('cz-CZ', {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "numeric"
        })}:: ${message.value}`)
    }
}