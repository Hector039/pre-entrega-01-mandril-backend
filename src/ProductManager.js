import fs from "fs";

class Product {
    constructor(id, title, description, code, price, stock, category, thumbnails, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails;
        this.status = status
    }
}

export class ProductManager {
    #path;
    #ultimoId = 0;
    #status = true;

    constructor() {
        this.#path = "./archivoProductos.json";
        this.#setUltimoId();
    }

    addProduct(title, description, code, price, stock, category, thumbnails) {

        try {

            const newProduct = new Product(
                ++this.#ultimoId,
                title,
                description,
                code,
                price,
                stock,
                category,
                [thumbnails],
                this.#status
            );

            return newProduct;

        } catch (error) {
            console.log("Se produjo un error creando el archivo", error.name);
        }
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.#path)) {
                const productos = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
                return productos;
            }

            return [];
        } catch (error) {
            console.log("error al leer el archivo", error.name);
        }
    }

    async getProductById(id) {
        try {
            const productos = await this.getProducts();
            const productoById = productos.find(producto => producto.id === id);

            if (productoById === undefined) {
                console.log("Producto no encontrado, intente con otro ID.");
            } else {
                return productoById;
            }

        } catch (error) {
            console.log("Error al leer el archivo", error.name);
        }
    }

    async #setUltimoId() {
        try {
            const productos = await this.getProducts();

            if (productos.length < 1) {
                this.#ultimoId = 0;
                return;
            }

            this.#ultimoId = productos[productos.length - 1].id;

        } catch (error) {
            console.log(error);
        }
    }

    async guardarProductos(productos) {
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(productos));
        } catch (error) {
            console.log(error);
        }
    }

}

