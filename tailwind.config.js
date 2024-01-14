const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        screens: {
            ...defaultTheme.screens,
            '3xl': '1920px',
            '4xl': '2560px',
        },
        extend: {},
    },
    plugins: [],
}
