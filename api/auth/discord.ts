// Vercel Serverless Function: Discord OAuth Token Exchange
// POST /api/auth/discord
//
// Receives a Discord authorization code, exchanges it for an access token,
// fetches the user profile, and creates a Firebase custom auth token.

import type { VercelRequest, VercelResponse } from '@vercel/node';

import admin from 'firebase-admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { code, redirectUri } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Authorization code is required' });
    }

    try {
        // Step 1: Exchange authorization code for access token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.VITE_DISCORD_CLIENT_ID!,
                client_secret: process.env.DISCORD_CLIENT_SECRET!,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri || process.env.VITE_DISCORD_REDIRECT_URI!,
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error('Discord token exchange failed:', errorData);
            return res.status(401).json({ message: 'Failed to exchange authorization code' });
        }

        const tokenData = await tokenResponse.json();

        // Step 2: Fetch user profile from Discord
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        if (!userResponse.ok) {
            return res.status(401).json({ message: 'Failed to fetch Discord user profile' });
        }

        const discordUser = await userResponse.json();

        // Step 3: Create Firebase custom token
        // Initialize Firebase Admin if not already done
        try {
            if (!admin.apps?.length) {
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
            }
        } catch (initErr: any) {
            console.error('Firebase init error:', initErr);
            return res.status(500).json({ message: `Firebase Init Error: ${initErr.message}` });
        }

        let customToken: string;
        try {
            // Create a custom token with the Discord user ID as the UID
            customToken = await admin.auth().createCustomToken(discordUser.id, {
                discordUsername: discordUser.username,
                discordAvatar: discordUser.avatar,
            });
        } catch (adminError: any) {
            console.error('Firebase Admin error:', adminError);
            return res.status(500).json({
                message: `Firebase Admin SDK init failed: ${adminError.message}`,
            });
        }

        // Return the custom token and user data
        return res.status(200).json({
            customToken,
            user: {
                id: discordUser.id,
                username: discordUser.username,
                discriminator: discordUser.discriminator,
                avatar: discordUser.avatar,
                email: discordUser.email,
            },
        });
    } catch (error) {
        console.error('Auth handler error:', error);
        return res.status(500).json({ message: 'Internal server error during authentication' });
    }
}
