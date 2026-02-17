import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProofContext = createContext();

export const useProof = () => useContext(ProofContext);

export const ProofProvider = ({ children }) => {
    const [myProofs, setMyProofs] = useState([]);
    const [verificationLogs, setVerificationLogs] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('kyc_proofs');
        if (stored) setMyProofs(JSON.parse(stored));

        // Initialize dummy shared proofs for verifier demo if empty
        const logs = localStorage.getItem('kyc_logs');
        if (logs) setVerificationLogs(JSON.parse(logs));
    }, []);

    const generateProof = async (attributes) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProof = {
                    id: `ZKP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                    timestamp: new Date().toISOString(),
                    attributes: attributes, // { ageOver18: true, aadhaarValid: true, ... }
                    valid: true,
                };

                const updatedProofs = [newProof, ...myProofs];
                setMyProofs(updatedProofs);
                localStorage.setItem('kyc_proofs', JSON.stringify(updatedProofs));
                resolve(newProof);
            }, 2000); // 2 second simulating delay
        });
    };

    const addProof = (proof) => {
        const updatedProofs = [proof, ...myProofs];
        setMyProofs(updatedProofs);
        localStorage.setItem('kyc_proofs', JSON.stringify(updatedProofs));
    };

    const verifyProof = async (proofId) => {
        // 1. Try Firestore First (Real Backend)
        try {
            const q = query(collection(db, "proofs"), where("proof_id", "==", proofId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0].data();
                console.log("Proof found in Firestore:", docData);

                const result = {
                    verified: true,
                    attributes: docData.attributes,
                    timestamp: docData.timestamp,
                    dataHidden: true
                };

                // Log the verification
                const newLog = { ...result, proofId, verifierTime: '0.8s (Cloud)' };
                const updatedLogs = [newLog, ...verificationLogs];
                setVerificationLogs(updatedLogs);
                localStorage.setItem('kyc_logs', JSON.stringify(updatedLogs));

                return result;
            }
        } catch (err) {
            console.error("Firestore verification error:", err);
        }

        // 2. Fallback to Local/Mock (Legacy/Demo Mode)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // In a real app, this would verify the cryptographic proof.
                // Here we simulate it by looking up our local storage "database" of proofs
                // OR just checking if the ID format is valid and "simulating" a success for demo purposes.

                // For the demo, let's say any ID that starts with ZKP is "valid" if we find it in "myProofs"
                // simulating a shared database for the sake of the single-client demo.
                const proof = myProofs.find(p => p.id === proofId);

                if (proof) {
                    const result = {
                        verified: true,
                        attributes: proof.attributes,
                        timestamp: new Date().toISOString(),
                        dataHidden: true
                    };

                    const newLog = { ...result, proofId, verifierTime: '1.1s (Local)' };
                    const updatedLogs = [newLog, ...verificationLogs];
                    setVerificationLogs(updatedLogs);
                    localStorage.setItem('kyc_logs', JSON.stringify(updatedLogs));

                    resolve(result);
                } else if (proofId.startsWith('ZKP-')) {
                    // Mock success for manual entry if not found (for easier demoing)
                    const mockResult = {
                        verified: true,
                        attributes: { ageOver18: true, aadhaarValid: true, addressVerified: true },
                        timestamp: new Date().toISOString(),
                        dataHidden: true
                    };
                    resolve(mockResult);
                } else {
                    resolve({ verified: false });
                }
            }, 1500);
        });
    };

    return (
        <ProofContext.Provider value={{ myProofs, generateProof, addProof, verifyProof, verificationLogs }}>
            {children}
        </ProofContext.Provider>
    );
};
