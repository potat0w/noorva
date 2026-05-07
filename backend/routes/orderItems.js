const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

// Get all order items
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        *,
        products (
          title,
          variants (
            id,
            color,
            price,
            variant_images (
              id,
              image_url,
              position
            )
          )
        ),
        orders (
          id,
          created_at,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order items by order ID
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        *,
        products (
          title,
          description,
          variants (
            id,
            color,
            price,
            variant_images (
              id,
              image_url,
              position
            )
          )
        )
      `)
      .eq('order_id', orderId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        *,
        products (
          title,
          variants (
            id,
            color,
            price,
            variant_images (
              id,
              image_url,
              position
            )
          )
        ),
        orders (
          id,
          created_at,
          status
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order item
router.post('/', async (req, res) => {
  try {
    const { order_id, product_id, quantity, price } = req.body;
    
    // Check if order exists
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', order_id)
      .single();
    
    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', product_id)
      .single();
    
    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { data, error } = await supabase
      .from('order_items')
      .insert([{ order_id, product_id, quantity, price }])
      .select(`
        *,
        products (
          title,
          variants (
            id,
            color,
            price,
            variant_images (
              id,
              image_url,
              position
            )
          )
        )
      `);

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, price } = req.body;
    
    const { data, error } = await supabase
      .from('order_items')
      .update({ quantity, price })
      .eq('id', id)
      .select(`
        *,
        products (
          title,
          variants (
            id,
            color,
            price,
            variant_images (
              id,
              image_url,
              position
            )
          )
        )
      `);

    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all order items for an order
router.delete('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
