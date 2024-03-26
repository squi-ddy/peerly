import { motion, AnimatePresence } from "framer-motion"
import { useContext, ReactElement, cloneElement } from "react"
import { logout } from "../api"
import MotionButton from "./MotionButton"
import MotionLink from "./MotionLink"
import MotionNavButton from "./MotionNavButton"
import { UserContext } from "./BasePage"

const itemVariants = {
    visible: (idx: number) => {
        return {
            opacity: 1,
            transform: "translateY(0px)",
            transition: { delay: idx === -1 ? 0 : 0.3 + idx * 0.2 },
        }
    },
    hidden: {
        opacity: 0,
        transform: "translateY(-20px)",
    },
    exit: {
        // opacity: 0,
        transform: "translateY(-20px)",
        transition: { delay: 0, duration: 0.3 }
    },
}

function NavBar() {
    const { user, updateUser, firstRender } = useContext(UserContext)

    let topBarItems: ReactElement[] = []

    if (user) {
        topBarItems = [
            <motion.p className="text-2xl" key="username">
                Hi <b>{user.username}</b>!
            </motion.p>,

            <MotionNavButton to="me" text="Profile" key="profile" />,
        ]
    }

    console.log("render navbar", user, firstRender)

    topBarItems = topBarItems.concat([
        <MotionNavButton to="tutors" text="Tutors" key="tutors" />,

        <MotionNavButton to="learners" text="Learners" key="learners" />,

        <MotionNavButton to="lessons" text="Lessons" key="lessons" />,

        user ? (
            <MotionButton
                text="Logout"
                key="logout"
                textSize="text-xl"
                onClick={async () => {
                    const res = await logout()
                    if (res.success) {
                        await updateUser()
                    }
                }}
            />
        ) : (
            <MotionNavButton to="auth" text="Login" key="login" />
        ),

        <MotionNavButton to="about" text="About" key="about" />,
    ])

    return (
        <AnimatePresence mode="popLayout">
            <MotionLink
                to="/"
                variants={itemVariants}
                initial={"hidden"}
                animate={"visible"}
                exit={"exit"}
                key="title"
                transition={{ duration: 0.3 }}
                className="text-5xl justify-self-start my-1 font-bold text-orange-400 drop-shadow-md"
            >
                Peerly
            </MotionLink>

            <div className="grow" key="grow" />

            {topBarItems.map((item, idx) => {
                return cloneElement(item, {
                    variants: itemVariants,
                    initial: "hidden",
                    animate: "visible",
                    exit: "exit",
                    layout: true,
                    custom: firstRender ? idx : -1,
                })
            })}
        </AnimatePresence>
    )
}

export default NavBar