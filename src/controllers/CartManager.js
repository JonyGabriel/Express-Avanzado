import { promises as fs } from 'fs'
import { nanoid } from "nanoid";
import ProductManager from './ProductManager.js';

const productAll = new ProductManager


class CartManager{
  constructor() {
    this.path = "./src/models/carts.json"
  }

//Leer carritos
  readCarts = async () => {
    let carts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(carts);
  };
//Escribir en el/los carritos
  writeCarts = async (carts) => {
    await fs.writeFile(this.path, JSON.stringify(carts))
  };
//Carritos existentes
  exist = async (id) => {
    let carts = await this.readCarts();
    return carts.find (cart => cart.id === id)
  }
//Agregar Carrito
  addCarts = async () => {
    let cartsOld = await this.readCarts();
    let id = nanoid()
    let cartsConcat = [{id : id, products : []}, ...cartsOld]
    await this.writeCarts(cartsConcat)
    return "Carrito Agregado"

  }
//Obtener ID por carritos
  getCartsById = async (id) => {
    let cartById = await this.exist(id)
    if(!cartById) return "Carrito no encontrado"
    return cartById
  };
//Agrego de producto en carrito por cantidad
  addProductInCart = async (cartId, productId) =>{
    let cartById = await this.exist(cartId)
    if(!cartById) return "Carrito no encontrado"
    let productById = await productAll.exist(productId)
    if(!cartById) return "Producto no encontrado"

    let cartsAll = await this.readCarts()
    let cartFilter = cartsAll.filter((cart) => cart.id != cartId)

    if(cartById.products.some(prod => prod.id === productId)){
      let moreProductInCart = cartById.products.find(
        (prod) => prod.id === productId
        );
        moreProductInCart.quantity++;
        console.log(moreProductInCart.quantity);
      let cartsConcat = [cartById, ...cartFilter]
      await this.writeCarts(cartsConcat)
      return "Producto Sumado al Carrito"
    }

    cartById.products.push({id:productById.id, quantity: 1})
    let cartsConcat = [cartById, ...cartFilter]
    await this.writeCarts(cartsConcat)
    return "Producto Agregado al Carrito"
  }

}


export default CartManager