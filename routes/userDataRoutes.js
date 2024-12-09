import { Router } from "express"
import { createUserData, deleteUserData, getUserData, updateUserData, updateUserImage } from "../controller/userData.controller.js"
import upload from "../middelware/multer.js"

const router = Router()

router.route('/createUserData').post(
    upload.fields([{ name: 'userImage', maxCount: 1 }]),
    createUserData
)

router.route('/getUserData').get(getUserData)

router.route('/updateUserData').put(updateUserData)

router.route('/updateUserImage').put(
    upload.single('userImage'),
    updateUserImage
)

router.route('/deleteUserData').delete(deleteUserData)




export default router