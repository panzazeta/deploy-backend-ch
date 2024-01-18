import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
import { ticketModel } from "../models/tickets.models.js"
import { userModel } from "../models/users.models.js";

export const getCart = async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartModel.findById(cid)
        if (cart)
            res.status(200).send({ respuesta: 'OK', mensaje: cart })
        else
            res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error })
    }
};

export const postCart = async (req, res) => {
    try {
        const cart = await cartModel.create({})
        res.status(200).send({ respuesta: 'OK', mensaje: cart })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear Carrito', mensaje: error })
    }
};

export const postCartProduct = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);
        if (cart) {
            const prod = await productModel.findById(pid);

            if (prod) {
                const existingProduct = cart.products.find(item => item.id_prod._id.toString() === pid);

                if (existingProduct) {
                    // Sumar la cantidad existente con la nueva cantidad
                    existingProduct.quantity += quantity;
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity });
                }

                const respuesta = await cartModel.findByIdAndUpdate(cid, { $set: { products: cart.products } }, { new: true });
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta });
            } else {
                res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Product Not Found' });
            }
        } else {
            res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Cart not Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ respuesta: 'Error en agregar producto Carrito', mensaje: error });
    }
};

export const deleteCartProduct = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartModel.findById(cid);
        if (cart) {
            const prod = await productModel.findById(pid);

            if (prod) {
                cart.products = cart.products.filter(item => item.id_prod._id.toString() !== pid); 
                await cartModel.findByIdAndUpdate(cid, { products: cart.products });
                res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado del carrito' });
            } else {
                res.status(404).send({ respuesta: 'Error al eliminar producto del Carrito', mensaje: 'Product Not Found' });
            }
        } else {
            res.status(404).send({ respuesta: 'Error al eliminar producto del Carrito', mensaje: 'Cart Not Found' });
        }

    } catch (error) {
        console.log(error);
        res.status(400).send({ respuesta: 'Error al eliminar producto del Carrito', mensaje: error });
    }
};

export const putCart = async (req, res) => {
    const { cid } = req.params;
    const newProducts = req.body;

    try {
        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).send({ respuesta: 'Error en actualizar carrito', mensaje: 'Cart Not Found' });
        }

        if (!Array.isArray(newProducts)) {
            return res.status(400).send({ respuesta: 'Error en actualizar carrito', mensaje: 'Please send a valid array' });
        }

        for (const newProduct of newProducts) {
            const { id_prod, quantity } = newProduct;

            const existingProductIndex = cart.products.findIndex(item => item.id_prod._id.toString() === id_prod);
            
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = quantity;
            } else {
                
                const productToAdd = {
                    id_prod: id_prod,
                    quantity: quantity
                };
                cart.products.push(productToAdd);
            }
        }

        const updatedCart = await cart.save();

        res.status(200).send({ respuesta: 'OK', mensaje: updatedCart });

    } catch (error) {
        console.error(error);
        res.status(400).send({ respuesta: 'Error en actualizar carrito', mensaje: error.message });
    }
};

export const putCartProduct = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);
        if (cart) {
            const indice = cart.products.findIndex(item => item.id_prod._id.toString() === pid);
            if (indice !== -1) {
                cart.products[indice].quantity = quantity;
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta });
            } else {
                res.status(404).send({ respuesta: 'Error al actualizar producto en el Carrito', mensaje: 'Product Not Found in Cart' });
            }
        } else {
            res.status(404).send({ respuesta: 'Error al actualizar producto en el Carrito', mensaje: 'Cart Not Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ respuesta: 'Error al actualizar producto en el Carrito', mensaje: error });
    }
};

export const deleteCart = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findByIdAndUpdate(cid, { products: [] });

        if (cart) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Carrito vaciado', cart });
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar productos del carrito', mensaje: 'Cart Not Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ respuesta: 'Error en eliminar productos del carrito', mensaje: error });
    }
};

export const postCheckout = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findById(cid).populate('products.id_prod');

        if (!cart) {
            return res.status(404).send({ respuesta: 'Error en Checkout', mensaje: 'Cart Not Found' });
        }

        const user = await userModel.findOne({ cart: cart._id });
        
        if (!user) {
            return res.status(404).send({ respuesta: 'Error en Checkout', mensaje: 'User Not Found' });
        }

        const productosNoComprados = [];
        let montoTotal = 0;
        const Subtotales = {};

        for (const product of cart.products) {
            const { id_prod, quantity } = product;

            if (!id_prod) {
                return res.status(404).send({ respuesta: 'Error en finalizar compra', mensaje: 'Product Not Found' });
            }

            const cadaProducto = id_prod;

            if (cadaProducto.stock >= quantity) {
                cadaProducto.stock -= quantity;
                await cadaProducto.save();
                const prodSubtotal = cadaProducto.price * quantity;

                if (!Subtotales[cadaProducto.category]) {
                    Subtotales[cadaProducto.category] = 0;
                }

                Subtotales[cadaProducto.category] += prodSubtotal;
                montoTotal += prodSubtotal;
            } else {
                productosNoComprados.push(id_prod);
                cart.products = cart.products.filter(item => item.id_prod.toString() !== id_prod.toString());
            }
        }

        // TICKET CHECKOUT
        const purchaser = user.email;
        let ticketMessage = 'Compra realizada con éxito';
        
        if (user.premium) {
            montoTotal *= 0.9; // Aplico un descuento del 10% a los usuarios premium
            ticketMessage = 'Compra realizada con éxito (Descuento por usuario premium aplicado)';
        }

        const ticket = await ticketModel.create({ amount: montoTotal, cart, purchaser, message: ticketMessage });
    
        if (productosNoComprados.length > 0) {
            cart.products = cart.products.filter(item => productosNoComprados.includes(item.id_prod.toString()));
            await cartModel.findByIdAndUpdate(cid, { products: cart.products });
        } else {
            await cartModel.findByIdAndUpdate(cid, { products: [] });
        }

        res.status(200).send({ respuesta: 'OK', mensaje: ticket.message, ticket });
    } catch (error) {
        console.error(error);
        res.status(400).send({ respuesta: 'Error en finalizar compra', mensaje: error.message });
    }
};
