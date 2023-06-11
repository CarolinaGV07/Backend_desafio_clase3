const fs = require ('fs')

class ProductManager {
    constructor (path) {   
        this.path = path 
        this.format = 'utf-8'
        this.id = 0
    }

    getId =async () => {
        const counter = this.path.length
        const id = (counter > 0) ? this.path[counter - 1].id +1 :1

        return id
    }
    addProduct = async (title, description,price,thumbnail,stock,code) => {
        
        if(!title || !description || !price || !thumbnail || !stock || !code){
            console.log("Se deben completar todos los campos")
            return false
        }

        const codeProd = await this.getProducts()
        const invalidCode = codeProd.some((prod) => {return prod.code === code })
        if(invalidCode){
            console.log("El còdigo ingresado ya fue utilizado")
        }

        const product = {title, description, price, thumbnail, stock, code, id: this.getId()}
        const list = await this.getProducts()
        list.push(product)

        await fs.promises.writeFile(this.path,JSON.stringify(list))
    }

    getProducts = async () => { 
        try {
            const date = await fs.promises.readFile(this.path, this.format)
            const dateObject = JSON.parse(date)
            return dateObject
        } catch (error) {
            console.log('No se encontro el archivo')
            return []
        }
        
    }
        
    getProductById = async (productId) => {

        const dateId = await this.getProducts()
        const findProduct = dateId.find((prod) => prod.id === productId);
        if(findProduct){
            return findProduct
        } else {
            console.error ("Not found")
        }


    }

    updateProduct = async (id,productObj) => {
        const upProd = await this.getProducts()
        const productIndex = upProd.findIndex((prod) => prod.id === id)
        if(!productIndex !== -1){
            console.log('El producto no existe')
            return; 
        }
        const updateProducts = upProd.map((product) =>{
            if(product.id===id){
                return {...product,...productObj}
    
            }
                return product
        })

        fs.promises.writeFile(this.path,JSON.stringify(updateProducts),'utf-8')
    }


    
    deleteProduct = async (productId) => {

        const delProd = await this.getProducts()
        const deleteProduct = delProd.filter ((prod) => prod.id !== productId)
        const prodExist = deleteProduct.findIndex((prod) => prod.id === productId)
        if(!prodExist !== -1){
            console.log('El producto no existe')
            return;
        }

        await fs.promises.writeFile(this.path, JSON.stringify(deleteProduct),'utf-8');
    }
}

    async function run () {
        const manager = new ProductManager('database.json')
        console.log(await manager.getProducts())
        await manager.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", 25 , "ABC123")
        console.log(await manager.getProducts())
        console.log(await manager.getProductById(1))
        console.log(await manager.updateProduct())
        console.log(await manager.deleteProduct())

    }

    run()