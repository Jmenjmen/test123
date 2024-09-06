import { KafkaListener, PaymentCreateListener } from "../kafla-listeners/payment-create-listener";
import { PaymentCanceledListener } from "../kafla-listeners/peyment-canceled-listener"

const kafkaPaymentCanceledListener = new PaymentCanceledListener();
const kafkaPaymentCreateListener = new PaymentCreateListener();
export const  listenersMap = new Map<string, ReadonlyArray<KafkaListener>>()
.set('payment-canceled-event', [kafkaPaymentCanceledListener])
.set('payment-event-test', [kafkaPaymentCreateListener])