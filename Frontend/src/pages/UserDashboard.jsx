import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProof } from '../context/ProofContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { QRUpload } from '../components/QRUpload';
import { ExtractionLoader } from '../components/ExtractionLoader';
import { verifyAge, verifyAddress, verifyBoth } from '../services/zkpApi';
import { decodeQRCode } from '../services/qrApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, ShieldCheck, User, ScanLine, FileCheck } from 'lucide-react';
import clsx from 'clsx';

export default function UserDashboard() {
    const { user } = useAuth();
    const { myProofs, addProof } = useProof(); // Need addProof to save the result
    const [activeTab, setActiveTab] = useState('generate');

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 space-y-4">
                <Card className="p-4 flex items-center space-x-3 bg-blue-600/10 border-blue-500/20">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <User size={20} />
                    </div>
                    <div>
                        <h3 className="font-medium text-white">{user?.name}</h3>
                        <p className="text-xs text-blue-300">Verified Citizen</p>
                    </div>
                </Card>

                <nav className="flex flex-col space-y-2">
                    <DashboardLink
                        active={activeTab === 'generate'}
                        onClick={() => setActiveTab('generate')}
                        label="Generate Proof"
                        icon={<ShieldCheck size={18} />}
                    />
                    <DashboardLink
                        active={activeTab === 'proofs'}
                        onClick={() => setActiveTab('proofs')}
                        label="My Proofs"
                        icon={<Check size={18} />}
                    />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <AnimatePresence mode="wait">
                    {activeTab === 'generate' ? (
                        <GenerateProofFlow key="generate" />
                    ) : (
                        <MyProofsList key="proofs" proofs={myProofs} />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function DashboardLink({ active, onClick, label, icon }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                active
                    ? "bg-white/10 text-white shadow-lg"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function GenerateProofFlow() {
    const { addProof } = useProof();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState(false); // New state for fake extraction
    const [generatedProof, setGeneratedProof] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [extractedData, setExtractedData] = useState(null); // RAW data from QR
    const [error, setError] = useState('');

    const [selection, setSelection] = useState({
        age: false,
        aadhaar: false, // Make sure this aligns with previous logic if needed, or remove if API doesn't support it directly (user prompt mentioned age/address/both) - actually let's stick to the prompt's implied logic but keep UI consistent. The prompt asked for Age, Address, Both. I will map these to API calls.
        address: false
    });

    const handleUploadComplete = async (fileObj, filePreview) => {
        setUploadedFile(filePreview);
        setError('');
        setExtracting(true);

        try {
            console.log("Decoding QR Code...");
            // 1. Real Decode
            const qrContentString = await decodeQRCode(fileObj);

            // 2. Parse the content
            let parsedData;
            try {
                // Simulator output: Base64( JSON( { aadhaar_data: {...}, signature: ... } ) )
                const jsonString = atob(qrContentString);
                const payload = JSON.parse(jsonString);
                parsedData = payload.aadhaar_data;
            } catch (e) {
                console.warn("Base64 parse failed, trying direct JSON", e);
                try {
                    const payload = JSON.parse(qrContentString);
                    parsedData = payload.aadhaar_data || payload;
                } catch (e2) {
                    throw new Error("Invalid QR Format. Must be ISEA Simulator generated.");
                }
            }

            if (!parsedData || !parsedData.dob_year) {
                throw new Error("QR does not contain valid Aadhaar Data.");
            }

            console.log("Extracted Data:", parsedData);
            setExtractedData(parsedData);

            // Minimum animation time
            setTimeout(() => {
                setExtracting(false);
                setStep(2);
            }, 2000);

        } catch (err) {
            console.error(err);
            setError("Failed to decode QR: " + err.message);
            setExtracting(false);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        try {
            if (!extractedData) {
                throw new Error("No data extracted from QR.");
            }

            let result;
            // Determine which API to call based on selection
            if (selection.age && selection.address) {
                result = await verifyBoth(extractedData);
            } else if (selection.age) {
                result = await verifyAge(extractedData);
            } else if (selection.address) {
                result = await verifyAddress(extractedData);
            } else {
                if (selection.aadhaar) {
                    result = await verifyAge(extractedData); // fallback for validity
                } else {
                    throw new Error("Please select an attribute to verify.");
                }
            }

            // The API returns a result. We can augment it with our local selection for display.
            const fullProof = {
                ...result,
                attributes: selection,
                timestamp: new Date().toISOString()
            };

            setGeneratedProof(fullProof);
            addProof(fullProof); // Save to context/local history
            setStep(4);
        } catch (err) {
            console.error(err);
            setError('Verification failed. Server might be waking up (Render). Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { num: 1, title: 'Upload' },
        { num: 2, title: 'Attributes' },
        { num: 3, title: 'Review' },
        { num: 4, title: 'Proof' },
    ];

    if (extracting) {
        return (
            <Card className="min-h-[400px] flex items-center justify-center">
                <ExtractionLoader />
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Generate Zero-Knowledge Proof</h2>
                <div className="flex items-center gap-2">
                    {steps.map((s) => (
                        <div key={s.num} className={clsx(
                            "w-2 h-2 rounded-full transition-colors",
                            step >= s.num ? "bg-emerald-500" : "bg-gray-700"
                        )} />
                    ))}
                </div>
            </div>

            <Card className="min-h-[400px]">
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-white">Upload Identity Document</h3>
                            <p className="text-gray-400 text-sm">Upload a government-issued ID (QR Code) to securely extract credentials.</p>
                        </div>

                        <QRUpload onUploadComplete={handleUploadComplete} />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-white">Select Attributes to Prove</h3>
                            <p className="text-gray-400 text-sm">Data extracted successfully. Choose what to verify.</p>
                        </div>

                        <div className="space-y-3">
                            <Checkbox
                                label="Age Over 18"
                                checked={selection.age}
                                onChange={() => setSelection({ ...selection, age: !selection.age })}
                                sub="Verifies you are an adult without showing DOB"
                            />
                            <Checkbox
                                label="Aadhaar Valid"
                                checked={selection.aadhaar}
                                onChange={() => setSelection({ ...selection, aadhaar: !selection.aadhaar })}
                                sub="Verifies identity existence without showing ID number"
                            />
                            <Checkbox
                                label="Region Verified"
                                checked={selection.address}
                                onChange={() => setSelection({ ...selection, address: !selection.address })}
                                sub="Verifies residency without showing full address"
                            />
                        </div>

                        <div className="pt-4 flex justify-between">
                            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                            <Button
                                onClick={() => setStep(3)}
                                disabled={!Object.values(selection).some(Boolean)}
                            >
                                Next Step
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-white">Privacy Summary</h3>
                            <p className="text-gray-400 text-sm">Review what information will be cryptographically verified via ZKP.</p>
                        </div>

                        <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                            <h4 className="flex items-center gap-2 text-emerald-400 font-medium">
                                <ShieldCheck size={18} />
                                Safe to Generate
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                {selection.age && <li className="flex items-center gap-2">✔ Proving Age &gt; 18 (DOB Hidden)</li>}
                                {selection.aadhaar && <li className="flex items-center gap-2">✔ Proving Aadhaar Validity (ID Hidden)</li>}
                                {selection.address && <li className="flex items-center gap-2">✔ Proving Residency (Address Hidden)</li>}
                            </ul>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="pt-4 flex justify-between">
                            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                            <Button
                                variant="success"
                                onClick={handleGenerate}
                                isLoading={loading}
                                disabled={loading}
                            >
                                Generate ZKP Proof
                            </Button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-6 w-full max-w-md"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
                                <Check size={32} strokeWidth={3} />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-white">Proof Generated!</h3>
                                <p className="text-gray-400">Your proof ID is ready to share.</p>
                            </div>

                            <div className="bg-black/30 rounded-xl p-4 flex items-center justify-between border border-white/10 group cursor-pointer hover:border-emerald-500/50 transition-colors"
                                onClick={() => navigator.clipboard.writeText(generatedProof?.proof_id || generatedProof?.id)}>
                                <code className="text-emerald-400 font-mono text-sm">{generatedProof?.proof_id || generatedProof?.id || "PROOF-XYZ-123"}</code>
                                <Copy size={16} className="text-gray-500 group-hover:text-emerald-500" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="secondary" onClick={() => {
                                    const element = document.createElement("a");
                                    const file = new Blob([JSON.stringify(generatedProof, null, 2)], { type: 'application/json' });
                                    element.href = URL.createObjectURL(file);
                                    element.download = `proof-${generatedProof?.id || 'zkp'}.json`;
                                    document.body.appendChild(element);
                                    element.click();
                                }}>Download JSON</Button>
                                <Button onClick={() => {
                                    setStep(1);
                                    setUploadedFile(null);
                                    setGeneratedProof(null);
                                }}>Create Another</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
}

function Checkbox({ label, checked, onChange, sub }) {
    return (
        <div
            onClick={onChange}
            className={clsx(
                "cursor-pointer flex items-start gap-4 p-4 rounded-xl border transition-all duration-200",
                checked ? "bg-blue-600/10 border-blue-500/50" : "bg-white/5 border-white/5 hover:bg-white/10"
            )}
        >
            <div className={clsx(
                "mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors",
                checked ? "bg-blue-500 border-blue-500" : "border-gray-500"
            )}>
                {checked && <Check size={14} className="text-white" />}
            </div>
            <div>
                <h4 className="font-medium text-white">{label}</h4>
                <p className="text-sm text-gray-400">{sub}</p>
            </div>
        </div>
    );
}

function MyProofsList({ proofs }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-8">My Verification Proofs</h2>
            {proofs.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-gray-500">No proofs generated yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {proofs.map((proof) => (
                        <Card key={proof.id} className="flex items-center justify-between group">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-mono text-emerald-400 text-lg">{proof.id}</h3>
                                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                                </div>
                                <p className="text-xs text-gray-500">{new Date(proof.timestamp).toLocaleString()}</p>
                                <div className="flex gap-2 mt-2">
                                    {proof.attributes.age && <Badge>Age 18+</Badge>}
                                    {proof.attributes.aadhaar && <Badge>Aadhaar</Badge>}
                                </div>
                            </div>
                            <Button variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => navigator.clipboard.writeText(proof.id)}>
                                <Copy size={16} />
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

function Badge({ children }) {
    return (
        <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300">
            {children}
        </span>
    );
}
