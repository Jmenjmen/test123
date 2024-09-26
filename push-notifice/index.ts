import express from "express"
import { KafkaEventListener } from "./kafka/kafka-listener";

const app = express();

const kafkaListener = new KafkaEventListener();

app.listen('9123', async () => {
    console.log('server started on localhost:9123')
    await kafkaListener.listener();
});