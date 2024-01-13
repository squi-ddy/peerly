import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

function MotionBase(props: {
    children: React.ReactNode
    delay?: number
    layout?: boolean
}) {
    const delay = props.delay || 0

    const baseVariants = {
        hidden: {},
        visible: {
            transition: {
                delayChildren: delay,
                staggerChildren: 0.3,
            },
        },
        exit: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    }

    return (
        <motion.div
            variants={baseVariants}
            initial={"hidden"}
            animate={"visible"}
            exit={"exit"}
            transition={{ duration: 0 }}
            layout={props.layout}
            className="grow flex flex-col gap-4 justify-center items-center w-full h-full min-h-0"
        >
            {props.children}
        </motion.div>
    )
}

export default MotionBase
