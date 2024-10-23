"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metric = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
const express_1 = __importDefault(require("express"));
const collectDefaultMetrics = prom_client_1.default.collectDefaultMetrics;
const Registry = prom_client_1.default.Registry;
const register = new Registry();
collectDefaultMetrics({ register });
const histogram = new prom_client_1.default.Histogram({
    name: 'stubed_events',
    help: 'stubed_events_help',
    labelNames: ['statusCode', 'method', 'eventName']
});
const gauge = new prom_client_1.default.Gauge({
    name: 'stubed_events_gauge',
    help: 'stubed_events_gauge_help',
    labelNames: ['statusCode', 'method', 'eventName']
});
const impressionGauge = new prom_client_1.default.Gauge({
    name: 'stubed_impression_counter',
    help: 'stubed_impression_counter',
    labelNames: ['type']
});
const paymentEventsHistogram = new prom_client_1.default.Histogram({
    name: 'payment_events',
    help: 'payment_events',
    labelNames: ['event_name']
});
register.registerMetric(histogram);
register.registerMetric(gauge);
register.registerMetric(impressionGauge);
const app = (0, express_1.default)();
class Metric {
    constructor() {
        this.isListening = false;
    }
    getMetric(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.set('Content-Type', register.contentType);
            res.send(yield register.metrics());
        });
    }
    HistogramObserve(method, eventName, statusCode, time) {
        console.log('histogram metric created');
        histogram.observe({
            statusCode: statusCode,
            method: method,
            eventName: eventName
        }, Number(time.toFixed(2)));
    }
    GaugeObserve(method, eventName, statusCode, time) {
        console.log('gauge metric created');
        gauge.set({ statusCode: statusCode, method: method, eventName: eventName }, Number(time.toFixed(2)));
    }
    ObserveTypeHistogram(type) {
        paymentEventsHistogram.observe({ event_name: type }, 1);
    }
    listen() {
        if (!this.isListening) {
            const metric = new Metric();
            app.get('/metrics', metric.getMetric);
            app.listen(4001);
        }
        else {
            console.warn('Metrics is listening');
        }
    }
}
exports.Metric = Metric;
