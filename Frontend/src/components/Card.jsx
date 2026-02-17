import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className }) {
    return (
        <div className={twMerge(clsx("glass-panel rounded-2xl p-6 glass-card-hover", className))}>
            {children}
        </div>
    );
}
