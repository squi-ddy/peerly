import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { FaChalkboardTeacher, FaPeopleCarry } from "react-icons/fa"
import { FaPerson } from "react-icons/fa6"
import MotionButton from "./MotionButton"
import { useNavigate } from "react-router"
import SetTitle from "./SetTitle"
import { useParams } from "react-router-dom"

function MainPage() {
    const [index, setIndex] = useState(0)
    const navigate = useNavigate()

    const { name } = useParams()

    useEffect(() => {
        const interval = setInterval(
            () => {
                setIndex((index + 1) % texts.length)
            },
            index === texts.length - 1 ? 1500 : 3000,
        )

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
                initial={{
                    opacity: 0,
                    transform:
                        index === 0 ? "translateX(0)" : "translateX(40px)",
                }}
                animate={{
                    opacity: index === texts.length - 1 ? 0 : 1,
                    transform: "translateX(0)",
                }}
                exit={{
                    opacity: 0,
                    transform:
                        index === texts.length - 2
                            ? "translateX(0)"
                            : "translateX(-40px)",
                }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                className="text-8xl text-orange-400 font-bold"
                key={index}
            >
                {text}
            </motion.h1>
        )
    })

    const itemVariants = {
        hidden: { transform: "translateY(-20px)", opacity: 0 },
        visible: { transform: "translateY(0)", opacity: 1 },
        exit: { opacity: 0 },
    }

    return (
        <>
            <SetTitle title="Peerly" />
            {name ? <div>Hi <b>{name}</b>!</div> : null}
            <div className="grow-[2]" />
            <motion.h1 variants={itemVariants} className="text-8xl">
                A place for
            </motion.h1>
            <motion.div variants={itemVariants}>
                <AnimatePresence mode="wait">
                    {textElements[index]}
                </AnimatePresence>
            </motion.div>

            <div className="grow-[3]" />

            <motion.h1 className="text-4xl" variants={itemVariants}>
                Peerly is a place for students to{" "}
                <span className="text-orange-400">collaborate</span> and{" "}
                <span className="text-orange-400">learn</span> together.
            </motion.h1>
            <motion.h1 className="text-4xl" variants={itemVariants}>
                Students can <span className="text-orange-400">mentor</span>{" "}
                each other, and <span className="text-orange-400">bond</span>{" "}
                with each other.
            </motion.h1>
            <div className="flex gap-2 w-full justify-center">
                <MotionButton
                    variants={itemVariants}
                    whileHover={{ transform: "translateY(-5px)" }}
                    text="Join Peerly"
                    textSize="text-2xl"
                    emphasis
                    onClick={() => {
                        navigate("/auth/register")
                    }}
                />
                <MotionButton
                    variants={itemVariants}
                    text="See Tutors"
                    textSize="text-2xl"
                    onClick={() => {
                        navigate("/tutors")
                    }}
                />
            </div>
            <div className="grow" />
            <div className="flex gap-4 w-full justify-center">
                <motion.div
                    variants={itemVariants}
                    className="border-2 rounded-xl p-4 w-1/5 aspect-square h-auto flex flex-col items-center justify-center gap-2"
                >
                    <FaChalkboardTeacher className="grow aspect-square w-auto max-h-[40%]" />
                    <h1 className="text-4xl text-orange-400 font-bold">
                        Mentorship
                    </h1>
                    <p className="text-xl text-center">
                        Students can mentor each other, learning from others,
                        but also reinforcing their own knowledge.
                    </p>
                </motion.div>
                <motion.div
                    variants={itemVariants}
                    className="border-2 rounded-xl p-4 w-1/5 aspect-square h-auto flex flex-col items-center justify-center gap-2"
                >
                    <FaPeopleCarry className="grow aspect-square w-auto max-h-[40%]" />
                    <h1 className="text-4xl text-orange-400 font-bold">
                        Bonding
                    </h1>
                    <p className="text-xl text-center">
                        Tutoring helps students bond with each other, and form
                        friendships that last a lifetime.
                    </p>
                </motion.div>
                <motion.div
                    variants={itemVariants}
                    className="border-2 rounded-xl p-4 w-1/5 aspect-square h-auto flex flex-col items-center justify-center gap-2"
                >
                    <FaPerson className="grow aspect-square w-auto max-h-[40%]" />
                    <h1 className="text-4xl text-orange-400 font-bold">
                        Personal
                    </h1>
                    <p className="text-xl text-center">
                        Peerly assigns 1-on-1 tutoring sessions, so that
                        students can get the most out of their time.
                    </p>
                </motion.div>
            </div>
            <div className="grow-[2]" />
        </>
    )
}

export default MainPage
