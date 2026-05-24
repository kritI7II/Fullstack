const express = require("express")
const router = express.Router()
const {getProducts ,createProduct ,updateProduct, deleteProduct, 
    addCart,getCart,deleteCart,clearCart
} = require("../controllers/productController")

router.get('/product', getProducts)
router.post('/create',createProduct)
router.put('/update/:id',updateProduct)
router.delete('/delete/:id', deleteProduct)
router.post('/v1/cart',addCart)
router.get('/v1/cart',getCart)
router.delete('/v1/cart/:id',deleteCart)
router.delete('/v1/clear',clearCart)
module.exports = router