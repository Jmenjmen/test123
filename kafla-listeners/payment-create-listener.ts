import { KafkaMessage } from "kafkajs";

export interface KafkaListener {
    onMessage(message: KafkaMessage): Promise<void>;
}

export class PaymentCreateListener implements KafkaListener {

    async onMessage(message: KafkaMessage): Promise<void> {
        console.log('peyment created listener is working', message.value?.toString());
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