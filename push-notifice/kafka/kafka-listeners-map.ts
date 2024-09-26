import { PaymentSendListener } from "../listeners/payment-send-listener";
import { KafkaListener } from "./kafka-listener";

const paymentSendListener = new PaymentSendListener();
export const listeners = new Map<string, ReadonlyArray<KafkaListener>>()
.set('payment-event-test', [paymentSendListener]);