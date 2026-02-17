/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#020617', // Deepest Slate/Navy
                surface: 'rgba(255, 255, 255, 0.03)', // Highly transparent white
                primary: '#3b82f6', // Cyber Blue
                secondary: '#10b981', // Neon Green
                accent: '#8b5cf6', // Electric Purple
                'glass-border': 'rgba(255, 255, 255, 0.08)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Space Mono', 'monospace'], // Tech feel for IDs/Hashes
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 90deg at 50% 50%, #020617 0%, #0f172a 50%, #020617 100%)',
            },
            boxShadow: {
                'neon': '0 0 20px rgba(16, 185, 129, 0.2)',
                'neon-blue': '0 0 20px rgba(59, 130, 246, 0.2)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            animation: {
                'blob': 'blob 7s infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
            },
        },
    },
    plugins: [],
}
