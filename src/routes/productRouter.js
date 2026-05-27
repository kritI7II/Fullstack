const express = require("express")
const router = express.Router()
const {getProducts, getProduct ,createProduct ,updateProduct, deleteProduct,deleteAll
} = require("../controllers/productController")

const { addCart, getCart, deleteCart,clearCart } = require('../controllers/cartController')

router.get('/products', getProducts)
router.get('/product/:id',getProduct)
router.post('/create',createProduct)
router.put('/update/:id',updateProduct)
router.delete('/deleted', deleteAll)
router.delete('/delete/:id', deleteProduct)


router.post('/v1/cart',addCart)
router.get('/v1/cart',getCart)
router.delete('/v1/cart/:id',deleteCart)
router.delete('/clear',clearCart)
module.exports = router