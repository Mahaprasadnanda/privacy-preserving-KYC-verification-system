import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Building2 } from 'lucide-react';

export default function VerifierSignup() {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        orgName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await signup(formData.email, formData.password, formData.orgName, 'verifier');
            navigate('/dashboard/verifier');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

            <Card className="w-full max-w-md relative z-10 glass-panel border-white/10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto flex items-center justify-center mb-4 border border-white/10 shadow-neon">
                        <Building2 className="w-8 h-8 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Verifier Registration</h2>
                    <p className="text-gray-400 mt-2">Register your organization to verify proofs.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Organization Name"
                        value={formData.orgName}
                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                        placeholder="Acme Corp"
                        required
                    />
                    <Input
                        label="Business Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="verifier@acme.com"
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••"
                        required
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="••••••"
                        required
                    />

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <Button variant="success" className="w-full" isLoading={loading}>
                            Register Organization
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                        <p>Already registered? <Link to="/login/verifier" className="text-secondary hover:text-emerald-400">Login here</Link></p>
                    </div>
                </form>
            </Card>
        </div>
    );
}
