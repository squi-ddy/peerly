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
import NavBar from "./NavBar"

type UserOrNull = IUser | null
export const UserContext = createContext<{
    user: UserOrNull
    updateUser: () => Promise<void>
    firstRender: boolean
}>({ user: null, updateUser: async () => {}, firstRender: true })

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

    return (
        <div id="root">
            <UserContext.Provider value={{ user: currentUser, updateUser, firstRender }}>
                <motion.div
                    variants={topBarVariants}
                    initial={"hidden"}
                    animate={"visible"}
                    exit={"exit"}
                    id="header"
                    className="pt-[20px] bg-gradient-to-r from-sky-900 to-sky-800 w-full mb-[-20px]"
                >
                    <div className="px-5 flex items-center justify-items-center p-2 gap-2">
                        <NavBar />
                    </div>
                </motion.div>

                {props.children}
            </UserContext.Provider>
        </div>
    )
}

export default BasePage
