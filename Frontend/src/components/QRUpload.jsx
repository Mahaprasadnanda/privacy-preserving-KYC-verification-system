import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileCheck, ShieldAlert } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import clsx from 'clsx';

export function QRUpload({ onUploadComplete }) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null); // Store actual file object
    const [error, setError] = useState('');

    const handleFile = (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file (JPG, PNG).');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB.');
            return;
        }

        setError('');
        setFileName(file.name);
        setUploadedFile(file); // Store the file object

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleConfirm = () => {
        console.log("handleConfirm called");
        console.log("preview:", preview);
        console.log("onUploadComplete:", onUploadComplete);
        console.log("uploadedFile:", uploadedFile);

        if (preview && onUploadComplete && uploadedFile) {
            console.log("Calling onUploadComplete with file:", uploadedFile);
            onUploadComplete(uploadedFile, preview);
        } else {
            console.error("Missing required data:", { preview, onUploadComplete, file: uploadedFile });
        }
    };

    const clearFile = () => {
        setPreview(null);
        setFileName('');
        setUploadedFile(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            {!preview ? (
                <div
                    className={clsx(
                        "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group",
                        error ? "border-red-500/50 bg-red-500/5" : "border-white/10 hover:border-primary/50 hover:bg-white/5"
                    )}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />

                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8 text-primary" />
                    </div>

                    <p className="text-lg font-medium text-white mb-1">
                        Upload Aadhaar QR Code
                    </p>
                    <p className="text-sm text-gray-400 text-center max-w-sm">
                        Drag & drop or click to browse. We support JPG and PNG.
                        <br />
                        <span className="text-xs opacity-60 mt-2 block">
                            Your document is processed locally and never stored unencrypted.
                        </span>
                    </p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg"
                        >
                            <ShieldAlert size={16} />
                            {error}
                        </motion.div>
                    )}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                >
                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/20 p-4">
                        <button
                            onClick={clearFile}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-red-500/80 text-white transition-colors z-10"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-white font-medium truncate">{fileName}</h4>
                                    <FileCheck className="w-4 h-4 text-emerald-400" />
                                </div>
                                <p className="text-sm text-gray-400">Ready for extraction</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Button variant="ghost" onClick={clearFile}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} className="px-8">
                            Continue to Extraction
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
