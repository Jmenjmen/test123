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

register.registerMetric(histogram);

const app = express();

export class Metric {

    async getMetric(req: Request, res: Response) {
        res.set('Content-Type', register.contentType);
        res.send(await register.metrics());
    }

    HistogramOberve(method: string, eventName: string, statusCode: number | undefined, time: number): void {
        console.log('metric created')
        histogram.observe({
            statusCode: statusCode,
            method: method,
            eventName: eventName
        }, Number(time.toFixed(2)));
    }
}

const metric = new Metric();
app.get('/metrics', metric.getMetric);

app.listen(2000);