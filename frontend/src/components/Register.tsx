import { AnimatePresence, motion } from "framer-motion"
import SetTitle from "./SetTitle"
import { useContext, useRef, useState } from "react"
import { BiShow, BiHide } from "react-icons/bi"
import MotionButton from "./MotionButton"
import { register } from "../api"
import { useNavigate } from "react-router-dom"
import { UserContext } from "./BasePage"

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

function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const confirmPasswordRef = useRef<HTMLInputElement>(null)
    const yearRef = useRef<HTMLInputElement>(null)
    const [errorText, setErrorText] = useState("")
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [yearError, setYearError] = useState(false)

    const navigate = useNavigate()

    const { updateUser } = useContext(UserContext)

    return (
        <>
            <SetTitle title="Register" />

            <motion.input
                variants={itemVariants}
                type="text"
                placeholder="Username"
                className={
                    "border-2 rounded-xl bg-transparent text-2xl w-5/6 p-2 text-center min-w-0 focus:border-sky-400 focus:outline-none transition-colors" +
                    (usernameError ? " border-red-500" : "")
                }
                layout
                ref={usernameRef}
            />
            <motion.div
                variants={itemVariants}
                className="flex gap-2 items-center w-5/6 h-fit"
                layout
            >
                <input
                    type={showPassword ? "text" : "password"}
                    className={
                        "grow border-2 rounded-xl bg-transparent text-2xl p-2 text-center min-w-0 focus:border-sky-400 focus:outline-none transition-colors" +
                        (passwordError ? " border-red-500" : "")
                    }
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
                    className={
                        "grow border-2 rounded-xl bg-transparent text-2xl p-2 text-center min-w-0 focus:border-sky-400 focus:outline-none transition-colors" +
                        (confirmPasswordError ? " border-red-500" : "")
                    }
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
                    className={
                        "border-2 rounded-xl bg-transparent text-2xl p-2 text-center min-w-0 w-20 focus:border-sky-400 focus:outline-none transition-colors" +
                        (yearError ? " border-red-500" : "")
                    }
                    min={1}
                    max={6}
                    defaultValue={1}
                    ref={yearRef}
                    onInput={(e) => {
                        const target = e.target
                        if (
                            "value" in target &&
                            typeof target.value === "string" &&
                            target.value.length > 0
                        ) {
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
            {errorText && (
                <motion.p
                    variants={itemVariants}
                    className="text-red-400 text-l"
                    layout
                >
                    {errorText}
                </motion.p>
            )}
            <MotionButton
                text="Submit"
                variants={itemVariants}
                onClick={async () => {
                    const username = usernameRef.current!.value
                    const password = passwordRef.current!.value
                    const confirmPassword = confirmPasswordRef.current!.value
                    const year = parseInt(yearRef.current!.value)
                    if (password !== confirmPassword) {
                        setUsernameError(false)
                        setPasswordError(true)
                        setConfirmPasswordError(true)
                        setYearError(false)
                        setErrorText("Passwords do not match")
                        return
                    }
                    const res = await register(username, password, year)
                    if (!res.success) {
                        const message = res.response!.data!.message
                        if (message === "Invalid username") {
                            setUsernameError(true)
                            setPasswordError(false)
                            setConfirmPasswordError(false)
                            setYearError(false)
                        } else if (message === "Invalid password") {
                            setUsernameError(false)
                            setPasswordError(true)
                            setConfirmPasswordError(false)
                            setYearError(false)
                        } else if (message === "Invalid year") {
                            setUsernameError(false)
                            setPasswordError(false)
                            setConfirmPasswordError(false)
                            setYearError(true)
                        } else if (message === "User already exists") {
                            setUsernameError(true)
                            setPasswordError(false)
                            setConfirmPasswordError(false)
                            setYearError(false)
                        }
                        setErrorText(message)
                    } else {
                        await updateUser()
                        navigate("/")
                    }
                }}
                textSize="text-xl"
                layout
            />
        </>
    )
}

export default Register
