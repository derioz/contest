import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Components
import AnimatedBackground from '@/components/ui/AnimatedBackground';

// Guards
import RequireAuth from '@/components/guards/RequireAuth';
import RequireAdmin from '@/components/guards/RequireAdmin';

// Pages
import Home from '@/pages/Home';
import AuthCallback from '@/pages/AuthCallback';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ContestManager from '@/pages/admin/ContestManager';
import Submit from '@/pages/Submit';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedBackground>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1A1A1A',
                color: '#FFFFFF',
                border: '1px solid #2A2A2A',
                fontFamily: 'Inter, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#22C55E',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />

          <Routes>
            {/* Auth Callback (no layout) */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              {/* Phase 2 */}
              <Route
                path="/submit"
                element={
                  <RequireAuth>
                    <Submit />
                  </RequireAuth>
                }
              />
              {/* Phase 3 stub */}
              <Route
                path="/vote"
                element={
                  <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="heading text-3xl text-text-primary mb-4">Voting</h1>
                    <p className="text-text-secondary">Coming in Phase 3</p>
                  </div>
                }
              />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<AdminDashboard />} />
              {/* Phase 2 */}
              <Route path="contests" element={<ContestManager />} />
              <Route
                path="submissions"
                element={
                  <div className="animate-fade-in">
                    <h1 className="heading text-3xl text-text-primary mb-4">Submissions</h1>
                    <p className="text-text-secondary">Coming in Phase 2</p>
                  </div>
                }
              />
              {/* Phase 3 stubs */}
              <Route
                path="users"
                element={
                  <div className="animate-fade-in">
                    <h1 className="heading text-3xl text-text-primary mb-4">Users</h1>
                    <p className="text-text-secondary">Coming in Phase 3</p>
                  </div>
                }
              />
              <Route
                path="bans"
                element={
                  <div className="animate-fade-in">
                    <h1 className="heading text-3xl text-text-primary mb-4">Ban List</h1>
                    <p className="text-text-secondary">Coming in Phase 3</p>
                  </div>
                }
              />
            </Route>
          </Routes>
        </AnimatedBackground>
      </AuthProvider>
    </BrowserRouter>
  );
}
