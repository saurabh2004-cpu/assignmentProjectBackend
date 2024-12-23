import { Router } from "express";
import { getCurrentUser, googleCallback, hello, loginUser, logoutUser, registerUser } from "../controller/auth.controller.js";
import passport from "passport";
import { verifyJwt } from "../middelware/auth.middleware.js";

const router = Router()

router.route('/hello').get(hello)

router.route('/signUp').post(registerUser)
router.route('/sign-in').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/getCurrentUser').get(verifyJwt,getCurrentUser)

//google auth
router.route('/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }),);


// Callback route for Google OAuth
router.route('/google/callback')
  .get(passport.authenticate('google', 
    { session: false, failureRedirect: 'https://assignment-project-frontend-cbs5.vercel.app/signUp' }),
     googleCallback);


export default router 