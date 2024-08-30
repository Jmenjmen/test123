import { Router } from "express";
import { Register } from "../auth/register/register-account";
import { Login } from "../auth/login/login-account";
import { isAuthorized } from "../utils/middlware/is-auth-middlware";
import { uploadVideoHandller } from '../video/video-upload';

const router = Router();

//auth
router.post('/auth/register', new Register().register);
router.post('/auth/login', new Login().login);

//test for authentication and tokens
router.post('/auth/test', isAuthorized, new Login().test);

//video
router.post('/video/upload', isAuthorized, new uploadVideoHandller().upload);



export default router;