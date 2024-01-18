import { Router } from "express";
import { getCart, postCart, deleteCart, deleteCartProduct, postCartProduct, putCart, putCartProduct, postCheckout } from "../controllers/cart.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";

const cartRouter = Router()

cartRouter.get('/:cid', getCart);
cartRouter.post('/', postCart);
cartRouter.post('/:cid/product/:pid', passportError('jwt'), authorization('user'), postCartProduct) //solo user puede agregar productos al cart
cartRouter.delete('/:cid/product/:pid', deleteCartProduct);
cartRouter.put('/:cid', putCart);
cartRouter.put('/:cid/product/:pid', putCartProduct);
cartRouter.delete('/:cid', deleteCart);
cartRouter.post('/:cid/purchase', postCheckout);

export default cartRouter