import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import Spacer from "./Spacer"
import MotionLink from "./MotionNavButton"
import MotionNavButton from "./MotionNavButton"

function BasePage(props: { title: string; children?: React.ReactNode }) {
    useEffect(() => {
        document.title = props.title
    }, [])

    const topBarVariants = {
        visible: {
            opacity: 1,
            y: "-10px",
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2,
            },
        },
        hidden: {
            opacity: 0,
            y: "-100%",
        },
    }

    const itemVariants = {
        visible: {
            opacity: 1,
            y: 0,
        },
        hidden: {
            opacity: 0,
            y: "-20px",
        },
    }

    const baseVariants = {
        hidden: {},
        visible: {},
        exit: {},
    }

    return (
        <motion.div
            variants={baseVariants}
            initial={"hidden"}
            animate={"visible"}
            exit={"exit"}
            transition={{ duration: 0 }}
            id="root"
        >
            <motion.div
                variants={topBarVariants}
                id="header"
                className="pt-[10px] bg-gradient-to-r from-sky-700 to-sky-600 w-full"
            >
                <div className="px-5 flex items-center justify-items-center p-2 gap-2">
                    <motion.a
                        href="/"
                        variants={itemVariants}
                        key="title"
                        transition={{ duration: 0.3 }}
                        className="text-5xl justify-self-start my-1 font-bold text-orange-400 drop-shadow-md"
                    >
                        Peerly
                    </motion.a>

                    <div className="flex-grow" />

                    <MotionNavButton
                        to="login"
                        text="Tutors"
                        variants={itemVariants}
                        key="tutors"
                    />

                    <MotionNavButton
                        to="login"
                        text="Learners"
                        variants={itemVariants}
                        key="students"
                    />

                    <MotionNavButton
                        to="login"
                        text="Lessons"
                        variants={itemVariants}
                        key="students"
                    />

                    <MotionNavButton
                        to="login"
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
        </motion.div>
    )
}

export default BasePage
