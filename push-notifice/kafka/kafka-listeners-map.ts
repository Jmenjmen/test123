import { Metric } from "metrics";
import { PaymentCancelListener } from "../listeners/payment-canceled-listener";
import { PaymentSendListener } from "../listeners/payment-send-listener";
import { KafkaListener } from "./kafka-listener";

export const metric = new Metric();
const paymentSendListener = new PaymentSendListener(metric);
const paymentCancelListener = new PaymentCancelListener(metric);
export const listeners = new Map<string, ReadonlyArray<KafkaListener>>()
.set('payment-event-test', [paymentSendListener])
.set('payment-canceled-event', [paymentCancelListener]);