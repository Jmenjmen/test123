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

register.registerMetric(histogram);
register.registerMetric(gauge);

const app = express();

export class Metric {

    async getMetric(req: Request, res: Response) {
        res.set('Content-Type', register.contentType);
        res.send(await register.metrics());
    }

    HistogramOberve(method: string, eventName: string, statusCode: number, time: number): void {
        console.log('histogram metric created')
        histogram.observe({
            statusCode: statusCode,
            method: method,
            eventName: eventName
        }, Number(time.toFixed(2)));
    }

    GaugeOberve(method: string, eventName: string, statusCode: number, time: number): void {
        console.log('gauge metric created')
        gauge.set({statusCode: statusCode, method: method, eventName: eventName}, Number(time.toFixed(2)));
    }
}

const metric = new Metric();
app.get('/metrics', metric.getMetric);

app.listen(4001);