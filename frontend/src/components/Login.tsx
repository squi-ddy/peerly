import { AnimatePresence, motion } from "framer-motion"
import SetTitle from "./SetTitle"
import { useRef, useState } from "react"
import { BiShow, BiHide } from "react-icons/bi"
import MotionButton from "./MotionButton"
import { login } from "../api"
import { useNavigate } from "react-router-dom"

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [errorText, setErrorText] = useState("")
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const navigate = useNavigate()

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
                    if (!username) {
                        setUsernameError(true)
                        setPasswordError(false)
                        setErrorText("Username is required")
                        return
                    }
                    if (!password) {
                        setPasswordError(true)
                        setUsernameError(false)
                        setErrorText("Password is required")
                        return
                    }
                    const res = await login(username, password)
                    if (!res.success) {
                        const message = res.response!.data!.message
                        setErrorText(message)
                        if (message === "Invalid username") {
                            setUsernameError(true)
                            setPasswordError(false)
                        } else if (message === "Invalid password") {
                            setPasswordError(true)
                            setUsernameError(false)
                        }
                    } else {
                        navigate("/")
                    }
                }}
                textSize="text-xl"
                layout
            />
        </>
    )
}

export default Login
