import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import typescript from "@rollup/plugin-typescript"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        typescript({
            tsconfig: "./tsconfig.build.json",
            include: ["./src/**/*.ts", "./src/**/*.tsx"],
        }),
        tailwindcss(),
    ],
    esbuild: false,
    build: {
        sourcemap: true,
    },
})
