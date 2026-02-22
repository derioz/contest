import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { onAuthChange, checkIsAdmin, getStoredUser, storeUser, clearStoredUser, logout } from '@/lib/auth';
import type { AppUser } from '@/lib/firestore-schema';

interface AuthContextType {
    user: AppUser | null;
    loading: boolean;
    isAdmin: boolean;
    setUser: (user: AppUser | null) => void;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    setUser: () => { },
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<AppUser | null>(getStoredUser());
    const [loading, setLoading] = useState(true);

    const setUser = (newUser: AppUser | null) => {
        setUserState(newUser);
        if (newUser) {
            storeUser(newUser);
        } else {
            clearStoredUser();
        }
    };

    const handleSignOut = async () => {
        await logout();
        setUser(null);
    };

    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in via Firebase — enrich with stored Discord data
                const stored = getStoredUser();
                if (stored) {
                    // Re-check admin status in case it changed
                    const isAdmin = await checkIsAdmin(stored.discordId);
                    const updated = { ...stored, isAdmin };
                    setUser(updated);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAdmin: user?.isAdmin ?? false,
                setUser,
                signOut: handleSignOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
