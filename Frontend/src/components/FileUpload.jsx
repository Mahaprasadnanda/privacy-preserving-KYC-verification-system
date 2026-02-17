import { useState, useCallback } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function FileUpload({ label, accept = "image/*", onFileSelect, className }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        setFile(selectedFile);
        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
        if (onFileSelect) onFileSelect(selectedFile);
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
        if (onFileSelect) onFileSelect(null);
    };

    return (
        <div className={twMerge(clsx("space-y-2", className))}>
            {label && <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>}

            <div
                className={clsx(
                    "relative w-full h-48 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden group",
                    dragActive ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20",
                    file ? "border-emerald-500/50 bg-emerald-500/5" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleChange}
                />

                {file ? (
                    <div className="w-full h-full flex flex-col items-center justify-center relative">
                        {preview ? (
                            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
                        ) : (
                            <FileText className="w-12 h-12 text-emerald-400 mb-2" />
                        )}

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mb-2 shadow-lg">
                                <CheckCircle2 className="text-white" size={20} />
                            </div>
                            <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-emerald-400">Ready to Process</p>
                        </div>

                        <button
                            onClick={removeFile}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-red-500/80 text-white transition-colors z-20"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                            <Upload className="text-blue-400" size={24} />
                        </div>
                        <p className="text-sm text-gray-300 font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </>
                )}
            </div>
        </div>
    );
}
