import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleAuthCallback } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get('code');

        if (!code) {
            setError('No authorization code received from Discord.');
            return;
        }

        async function exchangeCode(authCode: string) {
            try {
                const appUser = await handleAuthCallback(authCode);
                setUser(appUser);
                navigate('/', { replace: true });
            } catch (err) {
                console.error('Auth error:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
            }
        }

        exchangeCode(code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/15 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="heading text-2xl text-text-primary mb-3">Authentication Failed</h1>
                    <p className="text-text-secondary mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/', { replace: true })}
                        className="text-accent-orange hover:text-accent-orange-hover transition-colors font-heading uppercase tracking-wider text-sm"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-6 text-text-secondary font-heading uppercase tracking-wider text-sm animate-pulse">
                    Authenticating with Discord...
                </p>
            </div>
        </div>
    );
}
