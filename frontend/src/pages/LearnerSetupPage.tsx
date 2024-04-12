import {
    findTimeslots,
    getLearnerSubjects,
    getSubjects,
    sendLearnerSubjects,
} from "@/api"
import { UserContext } from "@/base/BasePage"
import Calendar, {
    IAdditionalSlot,
    IContiguousSlot,
    timestamps,
} from "@/components/Calendar"
import LearnerSubjectSelection, {
    IInputSubject,
} from "@/components/LearnerSubjectSelection"
import MotionButton from "@/components/MotionButton"
import SetTitle from "@/components/SetTitle"
import { ISubject } from "@backend/types/subject"
import { Time } from "@backend/types/timeslot"
import { motion } from "framer-motion"
import {
    ReactElement,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import { useLocation, useNavigate } from "react-router-dom"

const itemVariants = {
    hidden: { transform: "translateY(-20px)", opacity: 0 },
    visible: { transform: "translateY(0)", opacity: 1 },
    exit: { opacity: 0 },
}

const emptyArray: IAdditionalSlot[] = []

function LearnerSetupPage() {
    const { state, pathname } = useLocation()
    const { user, updateUser } = useContext(UserContext)
    const navigate = useNavigate()
    const [allSubjects, setAllSubjects] = useState<ISubject[] | null>(null)
    const [subjects, setSubjects] = useState<IInputSubject[]>([])

    const [floatingRef, setFloatingRef] = useState<HTMLElement | null>(null)
    const getContiguousSlots = useRef<() => IContiguousSlot[]>(() => [])

    const [dialog, setDialog] = useState<ReactElement | null>(null)
    const [errorText, setErrorText] = useState<string>("")

    const [calendarEditable, setCalendarEditable] = useState(true)
    const [calendarDrawContiguous, setCalendarDrawContiguous] = useState(true)
    const getFilters = useRef<() => IInputSubject[]>(() => [])

    useEffect(() => {
        if (state?.setup && pathname.includes("setup")) updateUser()
        getSubjects().then((subjects) => {
            if (subjects) setAllSubjects(subjects)
        })
    }, [pathname, state, updateUser])

    useEffect(() => {
        if (state?.setup) {
            return
        }
        if (!user || !user["is-learner"]) {
            navigate("/")
            return
        }
        if (!state?.setup && pathname.includes("setup")) {
            navigate("/")
            return
        }
        getLearnerSubjects({ "learner-sid": user["student-id"] }).then(
            (subjects) => {
                if (subjects)
                    setSubjects(
                        subjects.map((subject) => ({
                            ...subject,
                            includeInSearch: true,
                        })),
                    )
            },
        )
    }, [pathname, state, user, navigate])

    const submit = useCallback(async () => {
        if (!user) return false
        if (subjects.length === 0) {
            setErrorText("Please select at least one subject!")
            return false
        }
        const resp = await sendLearnerSubjects(
            subjects.map((subject) => ({
                "subject-code": subject["subject-code"],
                "learner-sid": user["student-id"],
            })),
        )
        if (!resp.success) {
            setErrorText("Internal Server Error: Failed to submit subjects!")
            return false
        }
        return true
    }, [subjects, user])

    const search = useCallback(async () => {
        if (!user) return false
        const contiguousSlots = getContiguousSlots.current()
        if (contiguousSlots.length === 0) {
            setErrorText("Please select at least one slot!")
            return false
        }
        const filteredSubjects = getFilters.current()
        console.log(filteredSubjects)
        if (filteredSubjects.length === 0) {
            setErrorText("Please select at least one subject!")
            return false
        }
        const resp = await findTimeslots({
            subjects: filteredSubjects,
            timeslots: contiguousSlots.map((slot) => ({
                "day-of-week": slot.dayOfWeek,
                "start-time": Time.fromHMString(timestamps[slot.beginIndex]),
                "end-time": Time.fromHMString(timestamps[slot.endIndex + 1]),
            })),
        })
        if (!resp) {
            setErrorText("Internal Server Error: Search failed!")
            return false
        }
        console.log(resp)
        return true
    }, [user])

    if (!allSubjects || !user) return <></>

    const pageTitle = state?.setup ? "Learner Setup" : "Learner Details"

    return (
        <>
            <SetTitle title={pageTitle} />
            <motion.div
                ref={setFloatingRef}
                variants={itemVariants}
                className="mb-1 flex flex-row w-4/5"
                layout
            >
                <h1 className="text-5xl">{pageTitle}</h1>
                <div className="grow" />
            </motion.div>
            <motion.div
                variants={itemVariants}
                className="flex flex-row w-4/5 mb-4"
                layout
            >
                <i>
                    We want to know what subjects you&apos;re interested in
                    learning!
                </i>
            </motion.div>
            <motion.div
                variants={itemVariants}
                className="flex flex-row w-4/5 h-2/3 gap-4 items-center"
                layout
            >
                <div className="h-full w-1/5 flex flex-col items-center gap-2">
                    <LearnerSubjectSelection
                        subjects={subjects}
                        setSubjects={setSubjects}
                        allSubjects={allSubjects}
                        reference={floatingRef!}
                        setDialog={setDialog}
                        setGetFilters={(f) => {
                            getFilters.current = f
                        }}
                    />
                </div>
                <div className="w-2/5 flex flex-col items-center gap-2">
                    <div className="flex flex-row w-full gap-2 justify-center">
                        <motion.div
                            variants={itemVariants}
                            className="text-3xl"
                            layout
                        >
                            Your Free Slots
                        </motion.div>
                        {!calendarEditable && (
                            <>
                                <div className="grow" />
                                <MotionButton
                                    text="Edit"
                                    variants={itemVariants}
                                    onClick={() => {
                                        navigate("/learner/slots")
                                    }}
                                    layout
                                />
                            </>
                        )}
                    </div>
                    <Calendar
                        defaultSelected={emptyArray}
                        setGetContiguousSlots={(f: () => IContiguousSlot[]) => {
                            getContiguousSlots.current = f
                        }}
                        edit={calendarEditable}
                        additionalSlots={emptyArray}
                        drawContiguousSlots={calendarDrawContiguous}
                    />
                </div>
                <div className="h-full w-2/5 flex flex-col items-center gap-2">
                    {/* <LearnerSubjectSelection
                        subjects={subjects}
                        setSubjects={setSubjects}
                        allSubjects={allSubjects}
                        reference={floatingRef!}
                        setDialog={setDialog}
                    /> */}
                </div>
            </motion.div>
            <motion.div
                variants={itemVariants}
                className="flex flex-row w-full justify-center gap-2"
                layout
            >
                {state?.setup && (
                    <MotionButton
                        variants={itemVariants}
                        text="Skip"
                        onClick={() => {
                            navigate("/")
                        }}
                    />
                )}
                <MotionButton
                    variants={itemVariants}
                    text="Save"
                    onClick={async () => {
                        if (!(await submit())) return
                        navigate("/")
                    }}
                />
                <MotionButton
                    variants={itemVariants}
                    text="Search..."
                    onClick={async () => {
                        if (!(await submit())) return
                        if (!(await search())) return
                    }}
                />
            </motion.div>
            {errorText && (
                <motion.div
                    variants={itemVariants}
                    className="-mt-2 text-sm text-center border-white border bg-red-400 py-1 px-2 rounded-md"
                    layout
                >
                    {errorText}
                </motion.div>
            )}
            {dialog}
        </>
    )
}

export default LearnerSetupPage
