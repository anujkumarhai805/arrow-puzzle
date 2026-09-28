import { Router } from 'express';
import supabase from '../supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

async function getOrCreateProfile(req) {
  const userId = req.user.id;

  // Existing profile
  const { data: existing, error: findError } = await supabase
    .from('profiles')
    .select('id, name, mobile, email, role, created_at, updated_at, game_state')
    .eq('id', userId)
    .maybeSingle();

  if (findError) throw findError;

  if (existing) {
    return existing;
  }

  // Create profile if missing
  const { data: created, error: createError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      name: req.user.user_metadata?.name || 'User',
      mobile: req.user.user_metadata?.mobile || '',
      email: req.user.email || '',
      role: 'user',
      game_state: {}
    })
    .select('id, name, mobile, email, role, created_at, updated_at, game_state')
    .single();

  if (createError) throw createError;

  return created;
}


/* ---------- PROFILE ---------- */

router.get('/me', requireAuth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req);

    res.json({
      profile
    });
  } catch (error) {
    console.error('PROFILE ERROR:', error);

    res.status(500).json({
      error: error.message
    });
  }
});


router.put('/me', requireAuth, async (req, res) => {
  try {
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

    if (error) throw error;

    res.json({
      profile: data
    });
  } catch (error) {
    console.error('PROFILE UPDATE ERROR:', error);

    res.status(400).json({
      error: error.message
    });
  }
});


/* ---------- GAME PROGRESS ---------- */

router.get('/me/game', requireAuth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req);

    res.json({
      game_state: profile.game_state || {}
    });
  } catch (error) {
    console.error('GAME LOAD ERROR:', error);

    res.status(500).json({
      error: error.message
    });
  }
});


router.put('/me/game', requireAuth, async (req, res) => {
  try {
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

    if (error) throw error;

    res.json({
      game_state: data.game_state
    });
  } catch (error) {
    console.error('GAME SAVE ERROR:', error);

    res.status(400).json({
      error: error.message
    });
  }
});


export default router;
