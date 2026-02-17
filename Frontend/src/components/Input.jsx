import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Input({ label, error, className, ...props }) {
    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>}
            <input
                className={twMerge(clsx(
                    "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all",
                    error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
                    className
                ))}
                {...props}
            />
            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
        </div>
    );
}
