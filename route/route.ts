import { Response, Request, Router } from "express";
import { Register } from "../auth/register/register-account";
import { Login } from "../auth/login/login-account";
import { isAuthorized } from "../utils/middlware/is-auth-middlware";
import { uploadVideoHandller } from '../video/video-upload';
import { getVideo } from "../video/get-videos";
import { StubEvent } from "../stub-events/stub-event";
import { Metric } from "../metrics/metrics";
import responseTime from "response-time";
import { kafkaConsumer } from "../kafka/kafka-consumer";
import { kafkaProducer } from "../kafka/kafka-producer";

const router = Router();
const uploadClass = new uploadVideoHandller();
const getVideoClass = new getVideo();

const KafkaProducer = new kafkaProducer();

const metric = new Metric();
const stubEvent = new StubEvent();

//auth
router.post('/auth/register', new Register().register);
router.post('/auth/login', new Login().login);

//test for authentication and tokens
router.post('/auth/test', isAuthorized, new Login().test);

//video
router.post('/video/upload', isAuthorized, uploadClass.upload.bind(uploadClass));
router.get('/video/watch/:username/:videoId', getVideoClass.getVideoStream.bind(getVideoClass));

//stub event
router.get('/stub/event', responseTime(async (req: Request, res: Response, time: number) => {
    metric.HistogramOberve(req.method, 'payment-event', res.statusCode, time);
    await KafkaProducer.sendPeymentCreatedEventMessage('payment created event test listener');
}), stubEvent.paymentEvent);
router.get('/stub/event2', responseTime(async (req: Request, res: Response, time: number) => {
    metric.GaugeOberve(req.method, 'payment-event', res.statusCode, time);
    await KafkaProducer.sendPeymentCanceledEventMessage('payment canceled event test listener');
}), stubEvent.paymentEvent);

export default router;