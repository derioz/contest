import { signInWithCustomToken, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { AppUser } from './firestore-schema';

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const DISCORD_REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI;

/**
 * Redirect user to Discord OAuth2 authorization page
 */
export function loginWithDiscord() {
    const params = new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        redirect_uri: DISCORD_REDIRECT_URI,
        response_type: 'code',
        scope: 'identify',
    });

    window.location.href = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

/**
 * Handle the OAuth callback - exchange code for Firebase custom token
 */
export async function handleAuthCallback(code: string): Promise<AppUser> {
    // Call our Vercel serverless function to exchange the code
    const response = await fetch('/api/auth/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirectUri: DISCORD_REDIRECT_URI }),
    });

    if (!response.ok) {
        let errorMessage = 'Authentication failed';
        try {
            const error = await response.json();
            errorMessage = error.message;
        } catch {
            // Fallback if Vercel returned an HTML error page (e.g. 500 error)
            errorMessage = `Server Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }

    const { customToken, user: discordUser } = await response.json();

    // Sign in to Firebase with the custom token
    await signInWithCustomToken(auth, customToken);

    // Check admin status
    const isAdmin = await checkIsAdmin(discordUser.id);

    return {
        uid: discordUser.id,
        discordId: discordUser.id,
        username: discordUser.username,
        avatarUrl: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator || '0') % 5}.png`,
        isAdmin,
    };
}

/**
 * Check if a Discord user ID is in the admins collection
 */
export async function checkIsAdmin(discordId: string): Promise<boolean> {
    try {
        const adminDoc = await getDoc(doc(db, 'admins', discordId));
        return adminDoc.exists();
    } catch {
        return false;
    }
}

/**
 * Sign out of Firebase
 */
export async function logout() {
    await signOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

/**
 * Get stored user data from localStorage
 */
export function getStoredUser(): AppUser | null {
    const stored = localStorage.getItem('vital_contest_user');
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

/**
 * Store user data to localStorage
 */
export function storeUser(user: AppUser) {
    localStorage.setItem('vital_contest_user', JSON.stringify(user));
}

/**
 * Clear stored user data
 */
export function clearStoredUser() {
    localStorage.removeItem('vital_contest_user');
}
