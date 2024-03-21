import { AnimatePresence, motion } from "framer-motion"
import MotionButton from "./MotionButton"
import { useEffect, useState, cloneElement, useContext } from "react"
import { useLocation, useNavigate, useOutlet } from "react-router-dom"
import { UserContext } from "./BasePage"
import { IUserFull } from "../types/user"
import { getCurrentProfile } from "../api"

const itemVariants = {
    hidden: { transform: "translateY(-20px)", opacity: 0 },
    visible: { transform: "translateY(0)", opacity: 1 },
    exit: { opacity: 0 },
}

const mainVariants = {
    hidden: { opacity: 0, transform: "translateY(-20px)" },
    visible: {
        opacity: 1,
        transform: "translateY(0)",
        transition: { when: "beforeChildren", staggerChildren: 0.3 },
    },
    exit: {
        opacity: 0,
        transition: { when: "afterChildren", staggerChildren: 0.05 },
    },
}

function ProfilePage() {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const [profileData, setProfileData] = useState<IUserFull | undefined>(undefined)

    useEffect(() => {
        if (!user) {
            navigate("/auth")
        } else {
            getCurrentProfile().then((data) => {
                if (data) {
                    setProfileData(data)
                }
            })
        }
    }, [user])

    if (!profileData) {
        return <></>
    }

    return (
        <>
            <motion.div variants={itemVariants} layout>
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl"
                >
                    Your Profile
                </motion.h1>
            </motion.div>
            <motion.div
                variants={mainVariants}
                className="flex flex-col gap-4 justify-center items-center border-2 rounded-xl p-4 w-1/3 flex flex-col items-center gap-2"
                layout
            >
                <ul className="list-disc text-2xl">
                <motion.li variants={itemVariants}>
                    <b>Username</b>: {profileData.username}
                </motion.li>
                <motion.li variants={itemVariants}>
                    <b>User ID</b>: {profileData.id}
                </motion.li>
                <motion.li variants={itemVariants}>
                    <b>Year</b>: {profileData.year}
                </motion.li>
                </ul>
            </motion.div>
        </>
    )
}

export default ProfilePage
