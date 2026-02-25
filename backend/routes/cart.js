const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Note: Cart is typically managed client-side (localStorage/context)
// These routes can be used if you want server-side cart management

// @GET /api/cart/validate - Validate cart items
router.post('/validate', protect, async (req, res) => {
  try {
    const { items } = req.body;
    const validatedItems = [];
    const errors = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        errors.push(`Product ${item.productId} not found`);
        continue;
      }
      if (product.stock < item.quantity) {
        errors.push(`Only ${product.stock} units available for ${product.name}`);
      }
      validatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        stock: product.stock,
        quantity: item.quantity
      });
    }

    res.json({ success: true, items: validatedItems, errors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
