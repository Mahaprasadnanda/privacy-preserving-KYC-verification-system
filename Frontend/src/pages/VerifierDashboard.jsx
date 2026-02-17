import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProof } from '../context/ProofContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ShieldCheck, Search, Clock, CheckCircle2, UserX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifierDashboard() {
    const { user } = useAuth();
    const { verifyProof, verificationLogs } = useProof();

    const [proofId, setProofId] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!proofId) return;

        setLoading(true);
        setError('');
        setVerificationResult(null);

        try {
            const result = await verifyProof(proofId);
            if (result.verified) {
                setVerificationResult(result);
            } else {
                setError('Invalid Proof ID or Proof Expired');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Verifier Dashboard</h1>
                    <p className="text-gray-400">Organization: <span className="text-secondary">{user?.name}</span></p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Connected to ZK-Rollup Node
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Verification Panel */}
                <Card className="h-fit">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Search className="text-blue-400" />
                        Verify Credential
                    </h2>

                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Paste ZKP Proof ID (e.g., ZKP-2025-...)"
                                className="flex-1 font-mono text-sm"
                                value={proofId}
                                onChange={(e) => setProofId(e.target.value)}
                            />
                            <Button type="submit" isLoading={loading} disabled={!proofId}>
                                Verify
                            </Button>
                        </div>
                    </form>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
                        >
                            <UserX size={20} />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    {verificationResult && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 space-y-4"
                        >
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Verification Successful</h3>
                                        <p className="text-xs text-gray-400">Cryptographic proof is valid</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <VerificationItem label="Age Verified" value={verificationResult.attributes?.age ? "Yes (18+)" : "Not Checked"} active={verificationResult.attributes?.age} />
                                    <VerificationItem label="Aadhaar Valid" value={verificationResult.attributes?.aadhaar ? "Valid" : "Not Checked"} active={verificationResult.attributes?.aadhaar} />
                                    <VerificationItem label="Region" value={verificationResult.attributes?.address ? "Verified" : "Not Checked"} active={verificationResult.attributes?.address} />
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-between text-xs text-blue-300">
                                <span className="flex items-center gap-2"><ShieldCheck size={14} /> Zero Knowledge Proof</span>
                                <span>No PII Received</span>
                            </div>
                        </motion.div>
                    )}
                </Card>

                {/* Recent Logs Component */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <Clock size={16} /> Recent Verifications
                    </h3>
                    <div className="space-y-3">
                        {verificationLogs.length === 0 ? (
                            <p className="text-gray-500 text-sm">No verification logs.</p>
                        ) : (
                            verificationLogs.map((log, i) => (
                                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div>
                                            <p className="text-white font-mono text-xs">{log.proofId}</p>
                                            <p className="text-gray-500 text-xs">{new Date(log.timestamp || Date.now()).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-emerald-400">Verified</p>
                                        <p className="text-xs text-gray-500">{log.verifierTime}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function VerificationItem({ label, value, active }) {
    return (
        <div className={`p-2 rounded border ${active ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" : "bg-white/5 border-white/5 text-gray-500"
            }`}>
            <span className="block text-xs uppercase tracking-wider opacity-60">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
