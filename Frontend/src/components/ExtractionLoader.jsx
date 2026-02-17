import { motion } from 'framer-motion';
import { Shield, Lock, Cpu } from 'lucide-react';

export function ExtractionLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="relative w-24 h-24">
                {/* Rotating Outer Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Pulse */}
                <motion.div
                    className="absolute inset-4 rounded-full bg-primary/20 blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-primary" />
                </div>
            </div>

            <div className="text-center space-y-2">
                <motion.h3
                    className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Extracting Secure Credentials...
                </motion.h3>
                <p className="text-gray-400 text-sm">
                    Decrypting Aadhaar QR inside secure enclave
                </p>
            </div>

            {/* Simulated Logic Steps */}
            <div className="flex space-x-2 text-xs text-gray-500 font-mono">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-1"
                >
                    <Lock size={12} /> Init
                </motion.div>
                <div className="text-gray-700">→</div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex items-center gap-1"
                >
                    <Cpu size={12} /> Parse
                </motion.div>
                <div className="text-gray-700">→</div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.0 }}
                    className="flex items-center gap-1"
                >
                    <Shield size={12} /> Verify
                </motion.div>
            </div>
        </div>
    );
}
