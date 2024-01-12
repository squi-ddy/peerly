import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { FaChalkboardTeacher, FaGraduationCap, FaPeopleCarry } from "react-icons/fa"
import { FaPerson } from "react-icons/fa6"

function MainPage() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((index + 1) % texts.length)
        }, (index === texts.length - 1 ? 1500 : 3000))

        return () => clearInterval(interval)
    }, [index])

    const texts = [
        "mentorship",
        "knowledge",
        "collaboration",
        "learning",
        "bonding",
        "a",
    ]

    const textElements = texts.map((text, index) => {
        return (
            <motion.h1
                initial={{ opacity: 0, x: (index === 0 ? 0 : "40px") }}
                animate={{ opacity: ((index === texts.length - 1) ? 0 : 1), x: 0 }}
                exit={{ opacity: 0, x: ((index === texts.length - 2) ? 0: "-40px") }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                className="text-8xl text-orange-400"
                key={index}
            >
                {text}
            </motion.h1>
        )
    })

    const mainVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { y: "-20px", opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { opacity: 0 },
    }

    return (
        <>
            <motion.div
                variants={mainVariants}
                className="flex-grow flex flex-col gap-4 justify-center items-center w-full"
            >
                <div className="flex-grow grow-[3]" />
                <motion.h1 variants={itemVariants} className="text-8xl">
                    A place for
                </motion.h1>
                <motion.div variants={itemVariants}>
                    <AnimatePresence mode="wait">
                        {textElements[index]}
                    </AnimatePresence>
                </motion.div>

                <div className="flex-grow grow-[3]" />

                <motion.h1 className="text-4xl" variants={itemVariants}>
                    Peerly is a place for students to{" "}
                    <span className="text-orange-400">collaborate</span> and{" "}
                    <span className="text-orange-400">learn</span> together.
                </motion.h1>
                <motion.h1 className="text-4xl" variants={itemVariants}>
                    Students can <span className="text-orange-400">mentor</span>{" "}
                    each other, and{" "}
                    <span className="text-orange-400">bond</span> with each
                    other.
                </motion.h1>
                <div className="flex-grow" />
                <div className="flex gap-4 w-full justify-center">
                    <motion.div
                        variants={itemVariants}
                        className="border-2 rounded-xl p-4 w-1/5 aspect-square h-full flex flex-col items-center gap-2">
                            <div className="flex-grow" />
                            <FaChalkboardTeacher size={250} />
                            <h1 className="text-4xl text-orange-400">Mentorship</h1>
                            <p className="text-xl text-center">
                                Students can mentor each other, learning from others, but also reinforcing their own knowledge.</p>
                            <div className="flex-grow" />
                    </motion.div>
                    <motion.div
                        variants={itemVariants}
                        className="border-2 rounded-xl p-4 w-1/5 aspect-square h-full flex flex-col items-center gap-2">
                            <div className="flex-grow" />
                            <FaPeopleCarry size={250} />
                            <h1 className="text-4xl text-orange-400">Bonding</h1>
                            <p className="text-xl text-center">
                                Tutoring helps students bond with each other, and form friendships that last a lifetime.
                            </p>
                            <div className="flex-grow" />
                    </motion.div>
                    <motion.div
                        variants={itemVariants}
                        className="border-2 rounded-xl p-4 w-1/5 aspect-square h-full flex flex-col items-center gap-2">
                            <div className="flex-grow" />
                            <FaPerson size={250} />
                            <h1 className="text-4xl text-orange-400">Personal</h1>
                            <p className="text-xl text-center">
                                Peerly assigns 1-on-1 tutoring sessions, so that students can get the most out of their time.
                            </p>
                            <div className="flex-grow" />
                    </motion.div>
                </div>
                <div className="flex-grow grow-[2]" />
            </motion.div>
        </>
    )
}

export default MainPage
