import { Router } from 'express';
import supabase from '../supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, mobile, email, role, created_at')
    .eq('id', req.user.id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  res.json({ profile: data });
});

router.put('/me', requireAuth, async (req, res) => {
  const { name, mobile } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .update({ name, mobile, updated_at: new Date().toISOString() })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ profile: data });
});

export default router;
