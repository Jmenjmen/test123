import { Router } from "express";
import { Register } from "../auth/register/register-account";
import { Login } from "../auth/login/login-account";
import { isAuthorized } from "../utils/middlware/is-auth-middlware";
import { isTokenValid } from "../utils/middlware/refresh-token";

const router = Router();

//auth
router.post('/auth/register', new Register().register);
router.post('/auth/login', new Login().login);

router.post('/auth/test', isTokenValid, isAuthorized,new Login().test);



export default router;