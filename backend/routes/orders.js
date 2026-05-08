const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const allocateVariantStock = async (productId, requestedQty) => {
  const { data: variants, error } = await supabase
    .from('variants')
    .select('id, stock')
    .eq('product_id', productId)
    .order('stock', { ascending: false });

  if (error) throw error;

  const totalStock = (variants || []).reduce((sum, variant) => sum + (variant.stock || 0), 0);
  if (totalStock < requestedQty) return false;

  let remaining = requestedQty;
  for (const variant of variants) {
    if (remaining <= 0) break;
    const available = variant.stock || 0;
    if (available <= 0) continue;

    const used = Math.min(available, remaining);
    const { error: updateError } = await supabase
      .from('variants')
      .update({ stock: available - used })
      .eq('id', variant.id);

    if (updateError) throw updateError;
    remaining -= used;
  }

  return true;
};

// Get all orders
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users (
          name,
          email
        ),
        order_items (
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
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
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
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users (
          name,
          email
        ),
        order_items (
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
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { 
      user_id, 
      total_price, 
      status = 'pending',
      full_name,
      phone,
      address,
      city,
      postal_code,
      items 
    } = req.body;

    // Start a transaction by creating the order first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id,
        total_price,
        status,
        full_name,
        phone,
        address,
        city,
        postal_code
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    if (items && items.length > 0) {
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      for (const item of items) {
        const ok = await allocateVariantStock(item.product_id, Number(item.quantity));
        if (!ok) {
          return res.status(400).json({ error: 'Insufficient stock' });
        }
      }

      // Clear user's cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user_id);
    }

    // Fetch the complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
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
        )
      `)
      .eq('id', order.id)
      .single();

    if (fetchError) throw fetchError;

    res.status(201).json(completeOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { total_price, status, full_name, phone, address, city, postal_code } = req.body;
    
    const { data, error } = await supabase
      .from('orders')
      .update({ total_price, status, full_name, phone, address, city, postal_code })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete order items first (foreign key constraint)
    await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);
    
    // Delete order
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
