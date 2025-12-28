/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: '#000000',
                accent: '#3B82F6',
                surface: '#FFFFFF',
                'surface-glass': 'rgba(255, 255, 255, 0.7)',
            }
        },
    },
    plugins: [],
}
