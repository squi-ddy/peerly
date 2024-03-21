import { AnimatePresence, motion } from "framer-motion"
import MotionNavButton from "./MotionNavButton"
import MotionLink from "./MotionLink"
import { getCurrentSession, logout } from "../api"
import React, {
    ReactElement,
    createContext,
    useCallback,
    useEffect,
    useState,
} from "react"
import { IUser } from "../types/user"
import MotionButton from "./MotionButton"

type UserOrNull = IUser | null
export const UserContext = createContext<{
    user: UserOrNull
    updateUser: () => Promise<void>
}>({ user: null, updateUser: async () => {} })

const topBarVariants = {
    visible: {
        transform: "translateY(-20px)",
    },
    hidden: {
        transform: "translateY(-100%)",
    },
    exit: {
        transform: "translateY(-100%)",
    },
}

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
        opacity: 0,
        transform: "translateY(-20px)",
    },
}

function BasePage(props: { children?: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<IUser | null | undefined>(
        undefined,
    )
    const [firstRender, setFirstRender] = useState(true)

    useEffect(() => {
        if (currentUser === undefined) {
            // doesn't count
            return
        }
        if (firstRender) {
            setFirstRender(false)
        }
    }, [currentUser, firstRender])

    const updateUser = useCallback(async () => {
        const user = await getCurrentSession()
        setCurrentUser(user)
    }, [])

    useEffect(() => {
        updateUser()
    }, [updateUser])

    if (currentUser === undefined) {
        return <></>
    }

    let topBarItems: ReactElement[] = []

    if (currentUser) {
        topBarItems = [
            <motion.p className="text-2xl" layout key="username">
                Hi <b>{currentUser.username}</b>!
            </motion.p>,

            <MotionNavButton to="me" text="Profile" key="profile" layout />,
        ]
    }

    topBarItems = topBarItems.concat([
        <MotionNavButton to="tutors" text="Tutors" key="tutors" />,

        <MotionNavButton to="learners" text="Learners" key="learners" />,

        <MotionNavButton to="lessons" text="Lessons" key="lessons" />,

        currentUser ? (
            <MotionButton
                text="Logout"
                key="logout"
                textSize="text-xl"
                onClick={async () => {
                    const res = await logout()
                    if (res.success) {
                        updateUser()
                    }
                }}
            />
        ) : (
            <MotionNavButton to="auth" text="Login" key="login" />
        ),

        <MotionNavButton to="about" text="About" key="about" />,
    ])

    return (
        <div id="root">
            <UserContext.Provider value={{ user: currentUser, updateUser }}>
                <motion.div
                    variants={topBarVariants}
                    initial={"hidden"}
                    animate={"visible"}
                    exit={"exit"}
                    id="header"
                    className="pt-[20px] bg-gradient-to-r from-sky-900 to-sky-800 w-full mb-[-20px]"
                >
                    <div className="px-5 flex items-center justify-items-center p-2 gap-2">
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
                                return React.cloneElement(item, {
                                    variants: itemVariants,
                                    initial: "hidden",
                                    animate: "visible",
                                    exit: "exit",
                                    layout: true,
                                    custom: firstRender ? idx : 0,
                                })
                            })}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {props.children}
            </UserContext.Provider>
        </div>
    )
}

export default BasePage
