import { Router } from 'express';
import supabase from '../supabase.js';

const router = Router();

router.post('/signup', async (req, res) => {
  const { name, mobile, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Name, email and password are required'
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        mobile: mobile || ''
      }
    }
  });

  if (error) {
    return res.status(400).json({
      error: error.message
    });
  }

  res.status(201).json({
    user: data.user,
    session: data.session,
    access_token: data.session?.access_token || null,
    refresh_token: data.session?.refresh_token || null
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return res.status(401).json({
      error: error.message
    });
  }

  res.json({
    user: data.user,
    session: data.session,
    access_token: data.session?.access_token || null,
    refresh_token: data.session?.refresh_token || null
  });
});

export default router;
