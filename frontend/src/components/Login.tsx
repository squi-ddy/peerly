import { AnimatePresence, motion } from "framer-motion"
import SetTitle from "./SetTitle"
import { useState } from "react"
import { BiShow, BiHide } from "react-icons/bi"
import MotionButton from "./MotionButton"

function Login() {
    const [showPassword, setShowPassword] = useState(false)

    const itemVariants = {
        hidden: { transform: "translateY(-20px)", opacity: 0 },
        visible: { transform: "translateY(0)", opacity: 1 },
        exit: { opacity: 0 },
    }

    const showIconVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    }

    return (
        <>
            <SetTitle title="Login" />
            <motion.input
                variants={itemVariants}
                type="text"
                placeholder="Username"
                className="border-2 rounded-xl bg-transparent text-2xl w-5/6 p-2 text-center min-w-0 focus:border-sky-400 focus:outline-none"
                layout
            />
            <motion.div
                variants={itemVariants}
                className="flex gap-2 items-center w-5/6 h-fit"
                layout
            >
                <input
                    type={showPassword ? "text" : "password"}
                    className="grow border-2 rounded-xl bg-transparent text-2xl p-2 text-center min-w-0 focus:border-sky-400 focus:outline-none"
                    placeholder="Password"
                />
                <div
                    className="p-2 border-2 rounded-xl aspect-square w-auto h-0 min-h-full shrink-0 hover:cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <AnimatePresence mode="wait">
                        {showPassword ? (
                            <motion.div
                                className="w-full h-full"
                                variants={showIconVariants}
                                initial={"hidden"}
                                animate={"visible"}
                                exit={"exit"}
                                transition={{ duration: 0.1 }}
                                key="hide"
                            >
                                <BiHide size={"100%"} />
                            </motion.div>
                        ) : (
                            <motion.div
                                className="w-full h-full"
                                variants={showIconVariants}
                                initial={"hidden"}
                                animate={"visible"}
                                exit={"exit"}
                                transition={{ duration: 0.1 }}
                                key="show"
                            >
                                <BiShow size={"100%"} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
            <MotionButton
                text="Submit"
                variants={itemVariants}
                onClick={() => {
                    alert("not implemented")
                }}
                textSize="text-xl"
                layout
            />
        </>
    )
}

export default Login
