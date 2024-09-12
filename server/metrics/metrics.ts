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

register.registerMetric(histogram);
register.registerMetric(gauge);
register.registerMetric(impressionGauge);

const app = express();

export class Metric {
    private actuallImpres = 0;
    private expectedImpres = 0;

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

    CounterExpectedObserve(): void {
        const random = Math.round(Math.random() * 100);
        this.expectedImpres += random
        console.log('counter expected metric created', this.expectedImpres);
        impressionGauge.set({ type: 'expected impressions' }, this.expectedImpres);
    }

    CounterActuallObserve(): void {
        const random = Math.round(Math.random() * 100);
        this.actuallImpres += random
        console.log('counter actually metric created', this.actuallImpres);
        impressionGauge.set({ type: 'actually impressions' }, this.actuallImpres);
    }
}

const metric = new Metric();
app.get('/metrics', metric.getMetric);

// const counterInterval = setInterval(() => {
//     metric.CounterActuallObserve();
//     metric.CounterExpectedObserve();
// }, 2000)

app.listen(4001);