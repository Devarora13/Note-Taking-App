import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Configure Google OAuth Strategy (done here to ensure env vars are loaded)
const configureGoogleOAuth = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth credentials not configured');
    return false;
  }

  passport.use('google', new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Check if user exists with the same email
        existingUser = await User.findOne({ email: profile.emails?.[0]?.value });

        if (existingUser) {
          // Link Google account to existing email account
          existingUser.googleId = profile.id;
          await existingUser.save();
          return done(null, existingUser);
        }

        // Create new user with Google account
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName || profile.name?.givenName || 'User',
          email: profile.emails?.[0]?.value,
          isVerified: true, // Google accounts are pre-verified
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, undefined);
      }
    }
  ));

  return true;
};

// Initiate Google OAuth
router.get('/google', (req, res, next) => {
  if (!configureGoogleOAuth()) {
    return res.status(501).json({ message: 'Google OAuth not configured' });
  }
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err: any, user: any) => {
    if (err) {
      console.error('Google OAuth callback error:', err);
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:8080';
      return res.redirect(`${frontendURL}/auth?error=oauth_failed`);
    }

    if (!user) {
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:8080';
      return res.redirect(`${frontendURL}/auth?error=oauth_failed`);
    }

    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:8080';
      res.redirect(`${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email
      }))}`);
    } catch (error) {
      console.error('JWT generation error:', error);
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:8080';
      res.redirect(`${frontendURL}/auth?error=oauth_failed`);
    }
  })(req, res, next);
});

// Get current user info (for frontend to check auth status)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await import('../models/User.js').then(m => m.default.findById(decoded.id).select('-otp -otpExpiry'));
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
