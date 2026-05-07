const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

// Get cart items for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          title,
          price,
          variants (
            id,
            color,
            stock,
            price,
            variant_images (
              id,
              image_url,
              position
            )
          )
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive integer' });
    }
    
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', product_id)
      .single();
    
    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('stock')
      .eq('product_id', product_id);

    if (variantsError) throw variantsError;
    const totalStock = (variants || []).reduce((sum, variant) => sum + (variant.stock || 0), 0);

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .single();

    let result;
    if (existingItem) {
      const newQuantity = existingItem.quantity + qty;
      if (totalStock < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select();

      if (error) throw error;
      result = data[0];
    } else {
      if (totalStock < qty) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id, product_id, quantity: qty }])
        .select();

      if (error) throw error;
      result = data[0];
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive integer' });
    }
    
    const { data: cartItem, error: cartError } = await supabase
      .from('cart_items')
      .select('id, product_id, quantity')
      .eq('id', id)
      .single();

    if (cartError || !cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('stock')
      .eq('product_id', cartItem.product_id);

    if (variantsError) throw variantsError;
    const totalStock = (variants || []).reduce((sum, variant) => sum + (variant.stock || 0), 0);

    if (totalStock < qty) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: qty })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart for a user
router.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
