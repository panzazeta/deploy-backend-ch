import { Router } from "express";
import { getProducts, getProductById, postProduct, putProductById, deleteProductById, getMockingProducts } from "../controllers/products.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";

const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/mockingproducts', getMockingProducts)
productRouter.get('/:id', getProductById)
productRouter.post('/', passportError('jwt'), authorization('admin'), postProduct)
productRouter.put('/:id', passportError('jwt'), authorization('admin'), putProductById)
productRouter.delete('/:id', passportError('jwt'), authorization('admin'), deleteProductById)

export default productRouter