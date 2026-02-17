import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export function Button({
    children,
    variant = 'primary',
    className,
    isLoading,
    ...props
}) {
    const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25",
        secondary: "bg-surface border border-white/10 hover:bg-white/5 text-gray-300",
        success: "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/25",
        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
        ghost: "hover:bg-white/5 text-gray-400 hover:text-white"
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], className))}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            )}
        </button>
    );
}
