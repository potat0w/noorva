const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        user_id,
        product_id,
        rating,
        comment,
        created_at,
        users (
          id,
          name
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user.userId;

    if (!product_id || !rating) {
      return res.status(400).json({ error: 'product_id and rating are required' });
    }

    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'rating must be an integer between 1 and 5' });
    }

    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .single();

    if (existing?.id) {
      return res.status(409).json({ error: 'You have already reviewed this product' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        user_id,
        product_id,
        rating: parsedRating,
        comment: comment || null,
      }])
      .select(`
        id,
        user_id,
        product_id,
        rating,
        comment,
        created_at,
        users (
          id,
          name
        )
      `)
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const parsedRating = Number(rating);

    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'rating must be an integer between 1 and 5' });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('reviews')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (existing.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to edit this review' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .update({
        rating: parsedRating,
        comment: comment || null,
      })
      .eq('id', id)
      .select(`
        id,
        user_id,
        product_id,
        rating,
        comment,
        created_at,
        users (
          id,
          name
        )
      `)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing, error: fetchError } = await supabase
      .from('reviews')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (existing.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
