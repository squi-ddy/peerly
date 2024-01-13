import { motion } from "framer-motion"
import SetTitle from "./SetTitle"

function AboutPage() {
    const itemVariants = {
        hidden: { transform: "translateY(-20px)", opacity: 0 },
        visible: { transform: "translateY(0)", opacity: 1 },
        exit: { opacity: 0 },
    }

    return (
        <>
            <SetTitle title="About" />
            <motion.h1 className="text-5xl font-bold" variants={itemVariants}>
                About
            </motion.h1>
            <motion.p className="text-2xl" variants={itemVariants}>
                <span className="text-orange-400 italic font-bold">Peerly</span>{" "}
                by Liu Wenkai, 2024
            </motion.p>
            <motion.p className="text-xl" variants={itemVariants}>
                Built with:
            </motion.p>
            <ul className="list-disc text-xl">
                <motion.li variants={itemVariants}>
                    <a
                        href="https://react.dev/"
                        target="_blank"
                        className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                    >
                        React
                    </a>{" "}
                    &ndash; Web and UI Framework
                </motion.li>
                <motion.li variants={itemVariants}>
                    <a
                        href="https://vitejs.dev/"
                        target="_blank"
                        className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                    >
                        Vite
                    </a>{" "}
                    &ndash; Builder and bundler
                </motion.li>
                <motion.li variants={itemVariants}>
                    <a
                        href="https://www.typescriptlang.org/"
                        target="_blank"
                        className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                    >
                        TypeScript
                    </a>{" "}
                    &ndash; Javascript but better
                </motion.li>
                <motion.li variants={itemVariants}>
                    <a
                        href="https://reactrouter.com/"
                        target="_blank"
                        className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                    >
                        React Router
                    </a>{" "}
                    &ndash; Browser-based routing library
                </motion.li>
                <motion.li variants={itemVariants}>
                    <a
                        href="https://tailwindcss.com/"
                        target="_blank"
                        className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                    >
                        TailwindCSS
                    </a>{" "}
                    &ndash; Main CSS styling tool
                </motion.li>
                <motion.li variants={itemVariants}>
                    <a
                        href="https://react-icons.github.io/react-icons/"
                        target="_blank"
                        className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                    >
                        React Icons
                    </a>{" "}
                    &ndash; SVG icons
                </motion.li>
                <motion.li variants={itemVariants}>
                    <a
                        href="https://www.framer.com/motion"
                        target="_blank"
                        className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                    >
                        Framer Motion
                    </a>{" "}
                    &ndash; Animations and transitions
                </motion.li>
                <motion.li variants={itemVariants}>
                    <a
                        href="https://fakerjs.dev/"
                        target="_blank"
                        className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                    >
                        Faker.js
                    </a>{" "}
                    &ndash; Fake data generator
                </motion.li>
                <motion.li variants={itemVariants}>
                    <a
                        href="https://www.fusejs.io/"
                        target="_blank"
                        className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                    >
                        Fuse.js
                    </a>{" "}
                    &ndash; Fuzzy search implementation
                </motion.li>
            </ul>
            <motion.p className="text-xl" variants={itemVariants}>
                Code formatted by{" "}
                <a
                    href="https://prettier.io/"
                    target="_blank"
                    className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                >
                    Prettier
                </a>
            </motion.p>
            <motion.p className="text-xl" variants={itemVariants}>
                Font is{" "}
                <a
                    href="https://fonts.google.com/specimen/Nunito"
                    target="_blank"
                    className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                >
                    Nunito
                </a>{" "}
                from{" "}
                <a
                    href="https://fonts.google.com/"
                    target="_blank"
                    className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                >
                    Google Fonts
                </a>
            </motion.p>
            <motion.p className="text-xl" variants={itemVariants}>
                15 React components, 1570 lines of code
            </motion.p>
            <motion.p className="text-xl" variants={itemVariants}>
                Created in 2 days + some help (autocomplete) from{" "}
                <a
                    href="https://github.com/features/copilot"
                    target="_blank"
                    className="underline hover:text-orange-400 transition-color duration-300 font-semibold"
                >
                    Copilot
                </a>
            </motion.p>
        </>
    )
}

export default AboutPage
