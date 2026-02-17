import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BankPortal() {
    const [status, setStatus] = useState('none'); // none, verifying, approved, rejected

    const handleVerify = () => {
        setStatus('verifying');
        setTimeout(() => {
            setStatus('approved');
        }, 2500);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
            <div className="max-w-xl mx-auto">
                {/* Mock Bank Header */}
                <div className="mb-8 text-center text-slate-800">
                    <h1 className="text-3xl font-bold mb-2">Open New Account</h1>
                    <p className="text-slate-500">Secure 3-minute onboarding process</p>
                </div>

                <Card className="bg-white text-slate-900 border-slate-200 shadow-md">
                    {status === 'none' && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Identity Verification</h3>
                                <p className="text-slate-600 text-sm">To comply with banking regulations, we need to verify your identity. You can use PrivacyKYC to prove your eligibility without sharing your documents.</p>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
                                    <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                                        <ShieldCheck size={16} /> Required Proofs:
                                    </div>
                                    <ul className="list-disc list-inside text-sm text-blue-600 pl-2">
                                        <li>Age &gt; 21</li>
                                        <li>Valid Resident</li>
                                        <li>No Criminal Record</li>
                                    </ul>
                                </div>
                            </div>

                            <Button onClick={handleVerify} className="w-full bg-blue-700 hover:bg-blue-800 shadow-none text-white">
                                Verify with PrivacyKYC
                            </Button>
                        </div>
                    )}

                    {status === 'verifying' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <div>
                                <h3 className="font-medium text-slate-900">Requesting KYC Proof...</h3>
                                <p className="text-sm text-slate-500">Please approve in your PrivacyKYC app</p>
                            </div>
                        </div>
                    )}

                    {status === 'approved' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-8 text-center space-y-6"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Account Approved</h2>
                                <p className="text-slate-500 mt-2">Identity verified successfully via ZK-Proof.</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-500 font-mono">
                                Proof ID: ZKP-BANK-2025-X992
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-transparent">
                                    Download Agreement
                                </Button>
                                <Button className="bg-blue-700 hover:bg-blue-800 text-white shadow-none">
                                    Go to Dashboard
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </Card>

                <p className="text-center text-xs text-slate-400 mt-8">
                    This is a demonstration portal simulating a 3rd party integration.
                </p>
            </div>
        </div>
    );
}
