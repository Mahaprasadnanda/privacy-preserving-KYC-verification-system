import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import VerifierDashboard from './pages/VerifierDashboard';
import BankPortal from './pages/BankPortal';
import UserSignup from './pages/UserSignup';
import VerifierSignup from './pages/VerifierSignup';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProofProvider } from './context/ProofContext';

function ProtectedRoute({ children, type }) {
    const { user, loading } = useAuth();

    if (loading) return null; // Or a loader

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (type && user.type !== type) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function AppContent() {
    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-secondary/30">
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />

                {/* Auth Routes */}
                <Route path="/login/user" element={<LoginPage />} />
                <Route path="/login/verifier" element={<LoginPage />} />
                <Route path="/signup/user" element={<UserSignup />} />
                <Route path="/signup/verifier" element={<VerifierSignup />} />

                {/* Protected User Routes */}
                <Route path="/dashboard/user" element={
                    <ProtectedRoute type="user">
                        <UserDashboard />
                    </ProtectedRoute>
                } />

                {/* Protected Verifier Routes */}
                <Route path="/dashboard/verifier" element={
                    <ProtectedRoute type="verifier">
                        <VerifierDashboard />
                    </ProtectedRoute>
                } />

                {/* Public Demo Portal (Simulated 3rd party) */}
                <Route path="/portal/bank" element={<BankPortal />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <ProofProvider>
                    <AppContent />
                </ProofProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
