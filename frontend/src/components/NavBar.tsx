import { motion, AnimatePresence } from "framer-motion"
import { useContext, ReactElement, cloneElement, useMemo } from "react"
import { logout } from "@/api"
import MotionButton from "./MotionButton"
import MotionNavButton from "./MotionNavButton"
import { UserContext } from "@/base/BasePage"

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

function NavBar() {
    const { user, updateUser, firstRender } = useContext(UserContext)

    const children = useMemo(() => {
        let topBarItems: ReactElement[] = []

        if (user) {
            topBarItems = [
                <motion.p className="text-2xl" key="username">
                    Hi <b>{user.username}</b>!
                </motion.p>,

                <MotionNavButton to="me" text="Profile" key="profile" />,
            ]
        }

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

        return topBarItems.map((item) => {
            return cloneElement(item, {
                variants: itemVariants,
                initial: "hidden",
                animate: "visible",
                exit: "exit",
                layout: true,
            })
        })
    }, [user, firstRender, updateUser])

    return <AnimatePresence mode="popLayout">{children}</AnimatePresence>
}

export default NavBar
