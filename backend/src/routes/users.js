import { Router } from 'express';
import supabase from '../supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, mobile, email, role, created_at, game_state')
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
    .update({
      name,
      mobile,
      updated_at: new Date().toISOString()
    })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ profile: data });
});

/* ---------- GAME PROGRESS ---------- */

router.get('/me/game', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('game_state')
    .eq('id', req.user.id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  res.json({
    game_state: data?.game_state || {}
  });
});

router.put('/me/game', requireAuth, async (req, res) => {
  const { game_state } = req.body;

  if (!game_state || typeof game_state !== 'object') {
    return res.status(400).json({
      error: 'game_state must be an object'
    });
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      game_state,
      updated_at: new Date().toISOString()
    })
    .eq('id', req.user.id)
    .select('game_state')
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({
    game_state: data.game_state
  });
});

export default router;
