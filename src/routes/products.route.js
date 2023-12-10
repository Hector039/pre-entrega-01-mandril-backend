import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const router = Router();

const productManager = new ProductManager();

/* router.get("/", (req, res) => {
    res.send("Hola Mundo desde products route");
});  */

router.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        const temporalProducts = await productManager.getProducts();

        if (limit) {
            const limitProducts = temporalProducts.filter((data, index) => index < limit);
            res.json({
                msg: "Lista de productos limitados con query",
                data: limitProducts,
                limit: limit,
                total: limitProducts.length === 0 ? "No hay productos cargados" : "Productos encontrados"
            });
        } else {
            res.json({
                total: temporalProducts.length === 0 ? "No hay productos cargados" : "Lista de todos los productos",
                data: temporalProducts
            })
        }

    } catch (error) {
        console.log(error.name);
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const productById = await productManager.getProductById(parseInt(pid));

        if (productById) {
            res.json({
                msg: "Se encontró el producto",
                data: productById
            })
        } else {
            res.json({
                msg: "El producto no existe, intente con otro ID."
            })
        }

    } catch (error) {
        console.log(error.name);
    }
});

router.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    const productos = await productManager.getProducts();
    const codeExistente = productos.some(product => product.code === code);

    try {
        if (!title || !description || !code || !price || !stock || !category) {
            res.status(400).json({
                error: "Faltan datos"
            })
        } else if (codeExistente) {
            res.status(400).json({
                error: "Código existente, intente con otro código."
            })
        } else {
            const newProduct = productManager.addProduct(
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails
            );

            productos.push(newProduct);

            await productManager.guardarProductos(productos);

            res.status(201).json({
                msg: "Producto creado correctamente.",
                data: newProduct
            })
        }
    } catch (error) {
        console.log(error.name);
    }

})

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const id = parseInt(pid)
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    try {
        const productos = await productManager.getProducts();
        const productoIndice = productos.findIndex(product => product.id === parseInt(pid));

        if (!title || !description || !code || !price || !stock || !category || !status) {
            res.status(400).json({
                error: "Faltan datos"
            })
        } else if (productoIndice === -1) {
            res.status(400).json({
                error: "No se encuentra el producto, intente con otro ID."
            })
        } else {

            const newProduct = {
                id,
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails: [thumbnails],
                status
            }

            productos[productoIndice] = newProduct;

            await productManager.guardarProductos(productos);

            res.status(201).json({
                msg: "Producto modificado correctamente.",
                data: productos[productoIndice]
            })
        }

    } catch (error) {
        console.log(error.name);
    }
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const productos = await productManager.getProducts();
        const productoIndice = productos.findIndex(product => product.id === parseInt(pid));

        if (productoIndice === -1) {
            res.status(400).json({
                error: "No se encuentra el producto, intente con otro ID."
            })
        } else {

            productos.splice(productoIndice, 1);

            await productManager.guardarProductos(productos);

            res.status(201).json({
                msg: "Producto eliminado correctamente.",
                data: productos[productoIndice]
            })
        }

    } catch (error) {
        console.log(error.name);
    }
});


export default router;