import { Router } from "express";
import { CartManager } from "../CartManager.js";
import { ProductManager } from "../ProductManager.js";

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        const newCart = cartManager.createCart();
        carts.push(newCart);
        await cartManager.saveCart(carts);

        res.status(201).json({
            msg: "Carrito creado correctamente.",
            data: newCart
        });
    } catch (error) {
        console.log(error.name);
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cartById = await cartManager.getCartById(parseInt(cid));

        if (cartById) {
            const temporalProducts = await productManager.getProducts();

            const cartProducts = cartById.productos.map(prod =>
                temporalProducts.find(producto => producto.id === prod.product)
            );

            res.status(201).json({
                msg: `Se encontró el carrito de ID: ${cid}`,
                data: cartProducts
            })
        } else {
            res.status(404).json({
                msg: "El carrito no existe, intente con otro ID."
            })
        }

    } catch (error) {
        console.log(error.name);
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const temporalProducts = await productManager.getProducts();
        const productIndex = temporalProducts.findIndex((product) => product.id === parseInt(pid));

        const carts = await cartManager.getCarts();
        const cartIndex = carts.findIndex((cart) => cart.id === parseInt(cid));

        if (cartIndex < 0) {
            res.status(404).json({
                msg: `El carrito ${cid} no existe, intente con otro ID.`
            })
            return;
        } else if (productIndex < 0) {
            res.status(404).json({
                msg: `El producto ${pid} no existe, intente con otro ID.`
            })
            return;
        }

        const cartIndexProduct = carts[cartIndex].productos.findIndex((prod) => prod.product === parseInt(pid));

        if (cartIndexProduct < 0) {

            const newProductToCart = {
                product: parseInt(pid),
                quantity: 1
            }
            carts[cartIndex].productos.push(newProductToCart);

            const cartProducts = carts[cartIndex].productos.map(prod =>
                temporalProducts.find(producto => producto.id === prod.product)
            );

            await cartManager.saveCart(carts);

            res.status(201).json({
                msg: `Producto ${pid} guardado correctamente en el carrito ${cid}.`,
                data: cartProducts
            });
        } else {
            let lastQuantity = carts[cartIndex].productos[cartIndexProduct].quantity;
            console.log(lastQuantity);

            carts[cartIndex].productos[cartIndexProduct].quantity = ++lastQuantity;

            const cartProducts = carts[cartIndex].productos.map(prod =>
                temporalProducts.find(producto => producto.id === prod.product)
            );

            await cartManager.saveCart(carts);

            res.status(201).json({
                msg: `Se sumó un producto ${pid} en el carrito ${cid}.`,
                cantidad: carts[cartIndex].productos[cartIndexProduct].quantity,
                data: cartProducts
            });
        }

    } catch (error) {
        console.log(error.name);
    }
});

export default router;