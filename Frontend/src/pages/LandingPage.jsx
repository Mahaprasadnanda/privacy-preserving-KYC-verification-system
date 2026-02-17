import { Link } from 'react-router-dom';
import { Shield, Lock, FileCheck, Banknote } from 'lucide-react';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';

export default function LandingPage() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 50, damping: 20 }
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Gradients & Blobs */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] animate-blob mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[128px] animate-blob animation-delay-2000 mix-blend-screen pointer-events-none" />
            <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[128px] animate-blob animation-delay-4000 mix-blend-screen pointer-events-none" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-6xl mx-auto px-4 text-center space-y-10 z-10 relative"
            >
                <motion.div variants={item} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-glass hover:bg-white/10 transition-colors cursor-default">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                    </span>
                    <span className="text-xs font-mono text-gray-300 tracking-wider uppercase">DPDP Act Compliant (Demo)</span>
                </motion.div>

                <motion.div variants={item} className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
                        <span className="block text-white mb-2 text-glow">Prove Identity</span>
                        <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent animate-pulse-slow">
                            Zero Exposure
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                        The world's first decentralized privacy-preserving KYC system using <span className="text-white font-medium">Zero-Knowledge Proofs</span>.
                        Verify credentials instantly without sharing sensitive data.
                    </p>
                </motion.div>

                <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    <Link to="/login/user">
                        <Button className="w-52 h-14 text-lg bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all shadow-neon">
                            Start Verification
                        </Button>
                    </Link>
                    <Link to="/login/verifier">
                        <Button variant="ghost" className="w-52 h-14 text-lg border border-white/10 hover:bg-white/5 hover:border-white/30 backdrop-blur-sm">
                            Verifier Portal
                        </Button>
                    </Link>
                </motion.div>

                {/* Features Grid */}
                <motion.div variants={item} className="grid md:grid-cols-3 gap-6 pt-24 text-left">
                    <FeatureCard
                        icon={<Shield className="w-8 h-8 text-blue-400" />}
                        title="Zero Knowledge"
                        description="Prove facts about yourself without sharing the actual data. Your privacy is mathematically guaranteed."
                        delay={0}
                    />
                    <FeatureCard
                        icon={<Lock className="w-8 h-8 text-emerald-400" />}
                        title="Secure Storage"
                        description="Your credentials never leave your device until you generate a cryptographic proof securely."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<Banknote className="w-8 h-8 text-purple-400" />}
                        title="Instant Approval"
                        description="Banks and services can verify your proofs in milliseconds without manual review or delays."
                        delay={0.2}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }) {
    return (
        <motion.div
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            className="group p-8 rounded-3xl bg-surface border border-glass-border hover:bg-white/5 hover:border-white/20 transition-all duration-300 backdrop-blur-md relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors border border-white/5 ring-1 ring-white/10">
                    {icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-glow transition-all">{title}</h3>
                <p className="text-gray-400 leading-relaxed font-light">{description}</p>
            </div>
        </motion.div>
    );
}
