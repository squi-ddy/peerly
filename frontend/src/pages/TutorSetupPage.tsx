import {
    getEmptyTimeslots,
    getSubjects,
    getTutorSubjects,
    sendEmptyTimeslots,
    sendSubjects,
} from "@/api"
import { UserContext } from "@/base/BasePage"
import MotionBase from "@/base/MotionBase"
import EditableCalendar, {
    ContiguousSlot,
    timestamps,
} from "@/components/EditableCalendar"
import MotionButton from "@/components/MotionButton"
import SetTitle from "@/components/SetTitle"
import TutorSubjectSelection, {
    IInputSubject,
} from "@/components/TutorSubjectSelection"
import { ISubject } from "@backend/types/subject"
import { Time } from "@backend/types/timeslot"
import { motion } from "framer-motion"
import { ReactElement, useContext, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const itemVariants = {
    hidden: { transform: "translateY(-20px)", opacity: 0 },
    visible: { transform: "translateY(0)", opacity: 1 },
    exit: { opacity: 0 },
}

function TutorSetupPage() {
    const { state, pathname } = useLocation()
    const { user, updateUser } = useContext(UserContext)
    const navigate = useNavigate()
    const [allSubjects, setAllSubjects] = useState<ISubject[] | null>(null)
    const [subjects, setSubjects] = useState<IInputSubject[]>([])

    const [floatingRef, setFloatingRef] = useState<HTMLElement | null>(null)

    const [dialog, setDialog] = useState<ReactElement | null>(null)
    const getContiguousSlots = useRef<() => ContiguousSlot[]>(() => [])
    const [errorText, setErrorText] = useState<string>("")

    const [defaultSelected, setDefaultSelected] = useState<ContiguousSlot[]>([])
    const [calendarApiReturned, setCalendarApiReturned] = useState(false)

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
        if (!user || !user["is-tutor"]) {
            navigate("/")
            return
        }
        if (!state?.setup && pathname.includes("setup")) {
            navigate("/")
            return
        }
        getEmptyTimeslots({ "tutor-sid": user["student-id"] }).then(
            (timeslots) => {
                if (!timeslots) throw new Error("Failed to get timeslots")
                setDefaultSelected(
                    timeslots.map((ts) => ({
                        dayOfWeek: ts["day-of-week"],
                        beginIndex: timestamps.indexOf(
                            `${ts["start-time"].hour
                                .toString()
                                .padStart(2, "0")}:${ts["start-time"].minute
                                .toString()
                                .padStart(2, "0")}`,
                        ),
                        endIndex:
                            timestamps.indexOf(
                                `${ts["end-time"].hour
                                    .toString()
                                    .padStart(2, "0")}:${ts["end-time"].minute
                                    .toString()
                                    .padStart(2, "0")}`.toString(),
                            ) - 1,
                    })),
                )
                setCalendarApiReturned(true)
            },
        )
        getTutorSubjects({ "tutor-sid": user["student-id"] }).then(
            (subjects) => {
                if (!subjects) throw new Error("Failed to get subjects")
                setSubjects(subjects)
            },
        )
    }, [pathname, state, user, navigate])

    if (!allSubjects || !user) return <></>

    const pageTitle = state?.setup ? "Tutor Setup" : "Tutor Details"

    return (
        <MotionBase>
            <SetTitle title={pageTitle} />
            <motion.div
                ref={setFloatingRef}
                variants={itemVariants}
                className="mb-1 flex flex-row w-2/3"
                layout
            >
                <h1 className="text-5xl">{pageTitle}</h1>
                <div className="grow" />
            </motion.div>
            <motion.div
                variants={itemVariants}
                className="flex flex-row w-2/3 mb-4"
                layout
            >
                <i>
                    We want to know when you&apos;re free, and what subjects you
                    want to teach!
                </i>
            </motion.div>
            <motion.div
                variants={itemVariants}
                className="flex flex-row w-2/3 h-2/3 gap-4 items-center"
                layout
            >
                <div className="h-full w-1/2 flex flex-col items-center gap-2">
                    <TutorSubjectSelection
                        subjects={subjects}
                        setSubjects={setSubjects}
                        allSubjects={allSubjects}
                        reference={floatingRef!}
                        setDialog={setDialog}
                    />
                </div>
                <div className="w-1/2 flex flex-col items-center gap-2">
                    <motion.div variants={itemVariants} className="text-3xl">
                        Your Free Slots
                    </motion.div>
                    {calendarApiReturned && (
                        <EditableCalendar
                            defaultSelected={defaultSelected}
                            setGetContiguousSlots={(
                                f: () => ContiguousSlot[],
                            ) => {
                                getContiguousSlots.current = f
                            }}
                        />
                    )}
                </div>
            </motion.div>
            <motion.div
                className="flex flex-row w-full justify-center gap-2"
                layout
            >
                {state?.setup && (
                    <MotionButton
                        variants={itemVariants}
                        text="Skip"
                        onClick={() => {
                            if (state?.learner) {
                                navigate("/setup/learner", {
                                    state: { setup: true },
                                })
                            } else {
                                navigate("/")
                            }
                        }}
                    />
                )}
                <MotionButton
                    variants={itemVariants}
                    text="Submit"
                    onClick={async () => {
                        if (subjects.length === 0) {
                            setErrorText("Please select at least one subject!")
                            return
                        }
                        const contiguousSlots = getContiguousSlots.current()
                        if (contiguousSlots.length === 0) {
                            setErrorText("Please select at least one slot!")
                            return
                        }
                        let resp = await sendSubjects(
                            subjects.map((subject) => ({
                                "subject-code": subject["subject-code"],
                                "subject-gpa": subject["subject-gpa"],
                                year: subject.year,
                                "tutor-sid": user["student-id"],
                            })),
                        )
                        if (!resp.success) {
                            setErrorText(
                                "Internal Server Error: Failed to submit subjects!",
                            )
                            return
                        }
                        resp = await sendEmptyTimeslots(
                            contiguousSlots.map((slot) => ({
                                "day-of-week": slot.dayOfWeek,
                                "start-time": Time.fromHMString(
                                    timestamps[slot.beginIndex],
                                ),
                                "end-time": Time.fromHMString(
                                    timestamps[slot.endIndex + 1],
                                ),
                            })),
                        )
                        if (!resp.success) {
                            setErrorText(
                                "Internal Server Error: Failed to submit timeslots!",
                            )
                            return
                        }
                        navigate("/")
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
        </MotionBase>
    )
}

export default TutorSetupPage
