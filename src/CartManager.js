import fs from "fs";

export class CartManager {
    #path;
    #ultimoId = 0;

    constructor() {
        this.#path = "./archivoCarritos.json";
        this.#setUltimoId();
    }

    createCart() {
        try {

            const newCart = {
                id: ++this.#ultimoId,
                productos: []
            }

            console.log(newCart);

            return newCart;

        } catch (error) {
            console.log(error);
        }
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.#path)) {
                const carts = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
                return carts;
            }

            return [];
        } catch (error) {
            console.log(error);
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();

            const cart = carts.find((cart) => cart.id === id);

            return cart;
        } catch (error) {
            console.log(error);
        }
    }

    async #setUltimoId() {
        try {
            const carts = await this.getCarts();

            if (carts.length < 1) {
                this.#ultimoId = 0;
                return;
            }

            this.#ultimoId = carts[carts.length - 1].id;

        } catch (error) {
            console.log(error);
        }
    }

    async saveCart(carts) {
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(carts));
        } catch (error) {
            console.log(error);
        }
    }
}
