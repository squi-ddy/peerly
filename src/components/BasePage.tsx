import { motion } from "framer-motion"
import MotionNavButton from "./MotionNavButton"
import MotionLink from "./MotionLink"

function BasePage(props: { children?: React.ReactNode }) {
    const topBarVariants = {
        visible: {
            transform: "translateY(-20px)",
            transition: {
                staggerChildren: 0.2,
            },
        },
        hidden: {
            transform: "translateY(-100%)",
        },
        exit: {
            transform: "translateY(-100%)",
        },
    }

    const itemVariants = {
        visible: {
            opacity: 1,
            transform: "translateY(0px)",
        },
        hidden: {
            opacity: 0,
            transform: "translateY(-20px)",
        },
        exit: {
            opacity: 0,
            transform: "translateY(-20px)",
        },
    }

    return (
        <div id="root">
            <motion.div
                variants={topBarVariants}
                initial={"hidden"}
                animate={"visible"}
                exit={"exit"}
                id="header"
                className="pt-[20px] bg-gradient-to-r from-sky-900 to-sky-800 w-full mb-[-20px]"
            >
                <div className="px-5 flex items-center justify-items-center p-2 gap-2">
                    <MotionLink
                        to="/"
                        variants={itemVariants}
                        key="title"
                        transition={{ duration: 0.3 }}
                        className="text-5xl justify-self-start my-1 font-bold text-orange-400 drop-shadow-md"
                    >
                        Peerly
                    </MotionLink>

                    <div className="grow" />

                    <MotionNavButton
                        to="/tutors"
                        text="Tutors"
                        variants={itemVariants}
                        key="tutors"
                    />

                    <MotionNavButton
                        to="/learners"
                        text="Learners"
                        variants={itemVariants}
                        key="learners"
                    />

                    <MotionNavButton
                        to="lessons"
                        text="Lessons"
                        variants={itemVariants}
                        key="lessons"
                    />

                    <MotionNavButton
                        to="auth"
                        text="Login"
                        variants={itemVariants}
                        key="login"
                    />

                    <MotionNavButton
                        to="about"
                        text="About"
                        variants={itemVariants}
                        key="about"
                    />
                </div>
            </motion.div>

            {props.children}
        </div>
    )
}

export default BasePage
