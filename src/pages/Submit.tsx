import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, addDoc, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Contest, Submission } from '@/lib/firestore-schema';
import { uploadImageToFiveManage } from '@/lib/fivemanage';
import toast from 'react-hot-toast';

import UploadZone from '@/components/submission/UploadZone';
import CategorySelector from '@/components/submission/CategorySelector';
import LivePreviewOverlay from '@/components/submission/LivePreviewOverlay';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Image, Trophy, AlertCircle } from 'lucide-react';

export default function Submit() {
    const { user, loading: authLoading } = useAuth();

    const [activeContest, setActiveContest] = useState<Contest | null>(null);
    const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);

    // Upload State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            fetchContestAndSubmission();
        }
    }, [user, authLoading]);

    const fetchContestAndSubmission = async () => {
        try {
            // 1. Get active contest
            const cq = query(collection(db, 'contests'), orderBy('createdAt', 'desc'), limit(1));
            const cSnapshot = await getDocs(cq);

            if (cSnapshot.empty) {
                setLoading(false);
                return;
            }

            const contestData = { id: cSnapshot.docs[0].id, ...cSnapshot.docs[0].data() } as Contest;
            setActiveContest(contestData);

            // 2. Check if user already submitted for THIS contest
            if (user) {
                const sq = query(
                    collection(db, 'submissions'),
                    where('contestId', '==', contestData.id),
                    where('userId', '==', user.uid),
                    limit(1)
                );
                const sSnapshot = await getDocs(sq);
                if (!sSnapshot.empty) {
                    setExistingSubmission({ id: sSnapshot.docs[0].id, ...sSnapshot.docs[0].data() } as Submission);
                }
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load contest data');
        } finally {
            setLoading(false);
        }
    };

    const handleImageValid = (file: File, tempUrl: string, width: number, height: number) => {
        setSelectedFile(file);
        setPreviewUrl(tempUrl);
        setImageWidth(width);
        setImageHeight(height);
    };

    const handleSubmit = async () => {
        if (!user || !activeContest || !selectedFile || !selectedCategoryId || !previewUrl) {
            toast.error('Please ensure all required fields are filled.');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload to FiveManage directly from client
            const hostedImageUrl = await uploadImageToFiveManage(selectedFile);

            // 2. Save submission to Firestore
            const newSubmission: Omit<Submission, 'id'> = {
                contestId: activeContest.id,
                categoryId: selectedCategoryId,
                userId: user.uid,
                username: user.username || 'Unknown User', // Fallback, auth context normally has this
                avatarUrl: user.avatarUrl || '',
                imageUrl: hostedImageUrl,
                imageWidth,
                imageHeight,
                status: 'pending',
                adminNotes: '',
                upvotes: 0,
                upvotedBy: [],
                createdAt: Timestamp.now(),
            };

            const docRef = await addDoc(collection(db, 'submissions'), newSubmission);

            setExistingSubmission({ id: docRef.id, ...newSubmission });
            toast.success('Your photo has been submitted successfully!');

            // Cleanup local blob
            URL.revokeObjectURL(previewUrl);
            setSelectedFile(null);
            setPreviewUrl(null);

        } catch (error: any) {
            console.error('Submission failed:', error);
            toast.error(error.message || 'Failed to submit entry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <LoadingSpinner />
            </div>
        );
    }

    // Not logged in guard (though App router should catch this with RequireAuth, it's safe to have)
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // 1. No Active Contest Guard
    if (!activeContest) {
        return (
            <div className="max-w-2xl mx-auto py-20 animate-fade-in text-center">
                <AlertCircle className="w-16 h-16 text-text-muted mx-auto mb-6" />
                <h1 className="heading text-3xl text-text-primary mb-4">No Active Contest</h1>
                <p className="text-text-secondary">
                    There isn't a photo contest running right now. Check back later!
                </p>
            </div>
        );
    }

    // 2. Wrong Phase Guard
    if (activeContest.phase !== 'submission') {
        return (
            <div className="max-w-2xl mx-auto py-20 animate-fade-in text-center space-y-6">
                <Trophy className="w-20 h-20 text-accent-orange mx-auto opacity-80" />
                <h1 className="heading text-4xl text-text-primary">Submissions Closed</h1>
                <p className="text-text-secondary text-lg">
                    The submission phase for <strong className="text-text-primary">{activeContest.name}</strong> has ended.
                </p>
                <p className="text-text-muted">
                    Current Phase: {activeContest.phase.toUpperCase()}. Head to the homepage to see the latest updates!
                </p>
                <Button onClick={() => window.location.href = '/'}>Return Home</Button>
            </div>
        );
    }

    // 3. Already Submitted Guard
    if (existingSubmission) {
        return (
            <div className="max-w-3xl mx-auto py-12 animate-fade-in space-y-8">
                <div className="text-center">
                    <h1 className="heading text-4xl text-accent-green mb-4">Entry Received!</h1>
                    <p className="text-text-secondary text-lg">
                        You've successfully submitted your screenshot for the <strong className="text-text-primary">{activeContest.name}</strong> contest.
                    </p>
                    <p className="text-sm text-text-muted mt-2">
                        (You can only submit one photo per month.)
                    </p>
                </div>

                <Card className="overflow-hidden border-accent-green/30 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                    <div className="relative h-[400px] w-full bg-bg-primary">
                        <img
                            src={existingSubmission.imageUrl}
                            alt="Your submission"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-border-subtle">
                            <span className="text-white font-heading tracking-widest uppercase text-sm">
                                Status: <span className="text-accent-orange ml-2">{existingSubmission.status}</span>
                            </span>
                        </div>

                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                            <div className="flex items-center gap-4">
                                <img src={existingSubmission.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-accent-orange" />
                                <div>
                                    <p className="text-white font-heading text-lg">{existingSubmission.username}</p>
                                    <p className="text-text-muted text-sm">
                                        {activeContest.categories.find(c => c.id === existingSubmission.categoryId)?.name || 'Unknown Category'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    // 4. Main Submission Flow
    return (
        <div className="max-w-4xl mx-auto py-12 animate-fade-in space-y-12">

            <div className="space-y-4">
                <h1 className="heading text-4xl text-text-primary">Submit Screenshot</h1>
                <p className="text-text-secondary text-lg max-w-2xl">
                    Upload your best shot for the <strong className="text-text-primary">{activeContest.name}</strong> contest.
                    The live preview overlay will show you exactly how it will look as a server loading screen.
                </p>
                <div className="bg-accent-orange/10 border border-accent-orange/20 rounded-lg p-4 max-w-2xl">
                    <p className="text-sm text-accent-orange">
                        <strong>Rule:</strong> You can only submit <strong>once</strong> per contest. Make it count!
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Step 1: Upload */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center font-heading text-text-primary">1</div>
                        <h2 className="heading text-2xl text-text-primary">Upload Image</h2>
                    </div>

                    <UploadZone
                        onImageValid={handleImageValid}
                        onClear={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setSelectedCategoryId(null); // Reset category if they change image
                        }}
                        isUploading={isSubmitting}
                    />
                </section>

                {previewUrl && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in">
                        {/* Step 2: Category (Left Column) */}
                        <section className="space-y-4 order-2 lg:order-1">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center font-heading text-text-primary">2</div>
                                <h2 className="heading text-2xl text-text-primary">Select Category</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <CategorySelector
                                    categories={activeContest.categories}
                                    selectedId={selectedCategoryId}
                                    onSelect={setSelectedCategoryId}
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Step 3: Publish */}
                            <div className="pt-8">
                                <Button
                                    size="lg"
                                    className="w-full text-lg h-14"
                                    disabled={!selectedCategoryId || isSubmitting}
                                    onClick={handleSubmit}
                                    isLoading={isSubmitting}
                                >
                                    <Image className="w-5 h-5 mr-3" />
                                    {isSubmitting ? 'Publishing Entry...' : 'Publish Entry'}
                                </Button>
                                <p className="text-center mt-3 text-sm text-text-muted">
                                    By publishing, you confirm this is your own unedited screenshot.
                                </p>
                            </div>
                        </section>

                        {/* Live Preview (Right Column Info) */}
                        <section className="order-1 lg:order-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="heading text-xl text-text-primary flex items-center gap-2">
                                    Live Preview Enabled
                                </h2>
                            </div>

                            <Card className="p-6 bg-accent-orange/5 border-accent-orange/20 text-text-secondary text-sm">
                                The dark gradient overlay you see on the screen simulates the server login experience.
                                This ensures your subject isn't obscured by the actual UI text when players load in.
                            </Card>
                        </section>
                    </div>
                )}
            </div>

            {/* Render the full screen overlay if there's a local preview url */}
            {previewUrl && !isSubmitting && (
                <LivePreviewOverlay imageUrl={previewUrl} />
            )}
        </div>
    );
}
