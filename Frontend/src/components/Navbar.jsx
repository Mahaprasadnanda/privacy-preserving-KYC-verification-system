import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User, Building2 } from 'lucide-react';
import { Button } from './Button';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isLoginPage = location.pathname.includes('/login');

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2 rounded-xl bg-gradient-to-tr from-secondary/20 to-primary/20 group-hover:from-secondary/30 group-hover:to-primary/30 transition-all duration-300">
                            <Shield className="h-6 w-6 text-secondary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-gray-400 bg-clip-text text-transparent tracking-tight">
                            PrivacyKYC
                        </span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                    {user.type === 'user' ? <User size={16} /> : <Building2 size={16} />}
                                    <span className="text-sm font-medium text-gray-300">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            !isLoginPage && (
                                <div className="flex items-center space-x-3">
                                    <Link to="/login/user">
                                        <Button variant="secondary" className="text-sm px-5 py-2 rounded-lg bg-blue-600/20 text-blue-100 border-blue-500/30 hover:bg-blue-600/30 hover:border-blue-500/50 hover:text-white hover:shadow-neon-blue transition-all">
                                            User Login
                                        </Button>
                                    </Link>
                                    <Link to="/login/verifier">
                                        <Button variant="primary" className="text-sm px-5 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-white shadow-lg shadow-secondary/20 border-none">
                                            Verifier Portal
                                        </Button>
                                    </Link>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
