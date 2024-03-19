import { AnimatePresence, motion } from "framer-motion"
import SetTitle from "./SetTitle"
import { useRef, useState } from "react"
import { BiShow, BiHide } from "react-icons/bi"
import MotionButton from "./MotionButton"

function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const passwordRef = useRef<HTMLInputElement>(null)
    const confirmPasswordRef = useRef<HTMLInputElement>(null)

    const itemVariants = {
        hidden: { transform: "translateY(-20px)", opacity: 0 },
        visible: { transform: "translateY(0)", opacity: 1 },
        exit: { opacity: 0 },
    }

    const staggerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.3 } },
        exit: { transition: { staggerChildren: 0.1 } },
    }

    const showIconVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    }

    return (
        <>
            <SetTitle title="Register" />

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
                    ref={passwordRef}
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
            <motion.div
                variants={itemVariants}
                className="flex gap-2 items-center w-5/6 h-fit"
                layout
            >
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="grow border-2 rounded-xl bg-transparent text-2xl p-2 text-center min-w-0 focus:border-sky-400 focus:outline-none"
                    placeholder="Confirm Password"
                    ref={confirmPasswordRef}
                />
                <div
                    className="p-2 border-2 rounded-xl aspect-square w-auto h-0 min-h-full shrink-0 hover:cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <AnimatePresence mode="wait">
                        {showConfirmPassword ? (
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
            <motion.div
                variants={itemVariants}
                className="flex gap-4 items-center h-fit"
                layout
            >
                <span className="text-2xl">Year</span>
                <input
                    type="number"
                    className="border-2 rounded-xl bg-transparent text-2xl p-2 text-center min-w-0 w-20 focus:border-sky-400 focus:outline-none"
                    min={1}
                    max={6}
                    defaultValue={1}
                    onInput={(e) => {
                        const target: any = e.target
                        if ("value" in e.target && target.value.length > 0) {
                            const value = parseInt(target.value)
                            if (value < 1 || Number.isNaN(value)) {
                                target.value = 1
                            } else if (value > 6) {
                                target.value = 6
                            }
                        }
                    }}
                />
            </motion.div>
            <MotionButton
                text="Submit"
                variants={itemVariants}
                onClick={() => {
                    if (
                        passwordRef.current!.value !==
                        confirmPasswordRef.current!.value
                    ) {
                        alert("Passwords do not match")
                        return
                    }
                    alert("not implemented")
                }}
                textSize="text-xl"
                layout
            />
        </>
    )
}

export default Register
