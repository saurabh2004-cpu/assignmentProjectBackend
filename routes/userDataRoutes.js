import { Router } from "express"
import { createUserData, deleteUserData, getUserData, updateUserData, updateUserImage } from "../controller/userData.controller.js"
import upload from "../middelware/multer.js"
import { verifyJwt } from "../middelware/auth.middleware.js"



const router = Router()

router.route('/createUserData').post(
    upload.fields([{ name: 'userImage', maxCount: 1 }]),
    verifyJwt,
    createUserData
)

router.route('/getUserData').get(verifyJwt,getUserData)

router.route('/updateUserData').put(verifyJwt,updateUserData)

router.route('/updateUserImage').put(
    upload.single('userImage'),
    verifyJwt,
    updateUserImage
)

router.route('/deleteUserData').delete(verifyJwt,deleteUserData)




export default router