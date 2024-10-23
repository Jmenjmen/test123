import { Request, Response } from "express";
import client from "prom-client";
import express from "express";

const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

const histogram = new client.Histogram({
    name: 'stubed_events',
    help: 'stubed_events_help',
    labelNames: ['statusCode', 'method', 'eventName']
});
const gauge = new client.Gauge({
    name: 'stubed_events_gauge',
    help: 'stubed_events_gauge_help',
    labelNames: ['statusCode', 'method', 'eventName']
});
const impressionGauge = new client.Gauge({
    name: 'stubed_impression_counter',
    help: 'stubed_impression_counter',
    labelNames: ['type']
});
const paymentEventsHistogram = new client.Histogram({
    name: 'payment_events',
    help: 'payment_events',
    labelNames: ['event_name']
});
const selledProducts = new client.Counter({
    name: 'stubed_selled_products',
    help: 'stubed_selled_products',
    labelNames: ['name', 'price', 'product_id']
})

register.registerMetric(histogram);
register.registerMetric(gauge);
register.registerMetric(impressionGauge);

const app = express();

export class Metric {
    private isListening = false;

    async getMetric(req: Request, res: Response) {
        res.set('Content-Type', register.contentType);
        res.send(await register.metrics());
    }

    HistogramObserve(method: string, eventName: string, statusCode: number, time: number): void {
        console.log('histogram metric created')
        histogram.observe({
            statusCode: statusCode,
            method: method,
            eventName: eventName
        }, Number(time.toFixed(2)));
    }

    GaugeObserve(method: string, eventName: string, statusCode: number, time: number): void {
        console.log('gauge metric created')
        gauge.set({statusCode: statusCode, method: method, eventName: eventName}, Number(time.toFixed(2)));
    }

    ObserveTypeHistogram(type: string): void {
        paymentEventsHistogram.observe({event_name: type}, 1);
    }

    ObserveSelledProducts(name: string, price: string, id: string): void {
        selledProducts.inc({name, price, product_id: id})
    }

    listen (): void {
        if(!this.isListening) {
            const metric = new Metric();
            app.get('/metrics', metric.getMetric);

            app.listen(4001);
        } else {
            console.warn('Metrics is listening');
        }
    }
}