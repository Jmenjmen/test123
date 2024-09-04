import { Response, Request, Router } from "express";
import { Register } from "../auth/register/register-account";
import { Login } from "../auth/login/login-account";
import { isAuthorized } from "../utils/middlware/is-auth-middlware";
import { uploadVideoHandller } from '../video/video-upload';
import { getVideo } from "../video/get-videos";
import { StubEvent } from "../stub-events/stub-event";
import { Metric } from "../metrics/metrics";
import responseTime from "response-time";

const router = Router();
const uploadClass = new uploadVideoHandller();
const getVideoClass = new getVideo();

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
router.get('/stub/event', responseTime((req: Request, res: Response, time: number) => {
    metric.HistogramOberve(req.method, 'payment-event', res.statusCode, time);
}), stubEvent.paymentEvent);

export default router;