import { Router } from "express";
import { getUsers, getUser, putUser, deleteUser, deleteInactiveUsers, recoveryMail, resetPassword, postDocuments, postProductsImage, postProfilePicture } from "../controllers/users.controller.js";
import { upload } from "../config/multer.js";


const userRouter = Router()

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.put('/:id', putUser);
userRouter.delete('/:id', deleteUser);
userRouter.delete('/', deleteInactiveUsers);
userRouter.post('/password-recovery', recoveryMail);
userRouter.post('/reset-password/:token', resetPassword);
userRouter.post('/:id/documents', upload.single('documents'), postDocuments);
userRouter.post('/:id/profiles', upload.single('profileImage'), postProfilePicture);
userRouter.post('/:id/products', upload.single('productImage'), postProductsImage);

export default userRouter