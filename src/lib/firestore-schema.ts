import { Timestamp } from 'firebase/firestore';

// ========================================
// Firestore Collection: /contests/{contestId}
// ========================================
export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Contest {
    id: string;
    name: string;            // e.g., "March 2026"
    month: number;            // 1-12
    year: number;
    categories: Category[];
    phase: ContestPhase;
    votingCloseDate: Timestamp;
    createdAt: Timestamp;
    createdBy: string;        // Admin Discord ID
}

export type ContestPhase = 'submission' | 'voting' | 'closed';

// ========================================
// Firestore Collection: /submissions/{submissionId}
// ========================================
export interface Submission {
    id: string;
    contestId: string;
    categoryId: string;
    userId: string;           // Discord User ID
    username: string;
    avatarUrl: string;
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    status: SubmissionStatus;
    adminNotes: string;
    upvotes: number;
    upvotedBy: string[];      // Array of Discord User IDs
    createdAt: Timestamp;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

// ========================================
// Firestore Collection: /admins/{discordId}
// ========================================
export interface Admin {
    discordId: string;
    username: string;
    addedAt: Timestamp;
}

// ========================================
// Firestore Collection: /bans/{discordId}
// ========================================
export interface BannedUser {
    discordId: string;
    username: string;
    reason: string;
    bannedBy: string;
    bannedAt: Timestamp;
}

// ========================================
// Discord User Profile (from OAuth)
// ========================================
export interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    email?: string;
}

// ========================================
// Auth User (enriched Firebase user)
// ========================================
export interface AppUser {
    uid: string;
    discordId: string;
    username: string;
    avatarUrl: string;
    isAdmin: boolean;
}
