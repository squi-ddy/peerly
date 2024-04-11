import { preciseFloor } from "@/util"
import { motion } from "framer-motion"
import { useCallback, useMemo, useRef, useState } from "react"

type CalendarData = {
    selected: boolean
}

export type ContiguousSlot = {
    dayOfWeek: number
    beginIndex: number
    endIndex: number
}

type CalendarArray = CalendarData[][]
type RefArray = (HTMLElement | null)[][]

const rows = 20
const columns = 5

// from 8:00 to 18:00, 0:30 separation => 20 slots

const emptyCalendarData: CalendarArray = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => {
        return { selected: false } as CalendarData
    }),
)

const defaultRefArray: RefArray = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => {
        return null
    }),
)

const days: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"]
export const timestamps: string[] = Array.from({ length: rows + 1 }, (_, i) => {
    return `${(8 + preciseFloor(i, 2)).toString().padStart(2, "0")}:${
        i % 2 ? "30" : "00"
    }`
})

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
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.02,
            duration: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: { when: "afterChildren", staggerChildren: 0.01 },
    },
}

function EditableCalendar(props: {
    defaultSelected: ContiguousSlot[]
    setGetContiguousSlots: (func: () => ContiguousSlot[]) => void
}) {
    const defaultCalendarData = useMemo(() => {
        const calendarData = [...emptyCalendarData]
        for (const slot of props.defaultSelected) {
            for (let i = slot.beginIndex; i <= slot.endIndex; i++) {
                calendarData[i][slot.dayOfWeek].selected = true
            }
        }
        return calendarData
    }, [props.defaultSelected])

    const [calendarData, setCalendarData] =
        useState<CalendarArray>(defaultCalendarData)
    const [dragging, setDragging] = useState(false)
    const [startCell, setStartCell] = useState<[number, number]>([-1, -1])
    const [endCell, setEndCell] = useState<[number, number]>([-1, -1])
    const [fill, setFill] = useState(false)

    const refs = useRef(defaultRefArray)
    const referenceRef = useRef<HTMLDivElement | null>(null)
    const [finishedRender, setFinishedRender] = useState(false)

    const setRef = useCallback(
        (i: number, j: number) => (ref: HTMLElement | null) => {
            refs.current[i][j] = ref
        },
        [],
    )

    const commitSelection = () => {
        const newCalendarData = [...calendarData]
        for (
            let i = Math.min(startCell[0], endCell[0]);
            i <= Math.max(startCell[0], endCell[0]);
            i++
        ) {
            for (
                let j = Math.min(startCell[1], endCell[1]);
                j <= Math.min(startCell[1], endCell[1]);
                j++
            ) {
                newCalendarData[i][j].selected = fill
            }
        }
        setCalendarData(newCalendarData)
    }

    const isSelected = useCallback(
        (i: number, j: number): boolean | undefined => {
            if (
                i >= Math.min(startCell[0], endCell[0]) &&
                i <= Math.max(startCell[0], endCell[0]) &&
                j >= Math.min(startCell[1], endCell[1]) &&
                j <= Math.max(startCell[1], endCell[1])
            ) {
                return fill
            }
            return i < calendarData.length
                ? calendarData[i][j].selected
                : undefined
        },
        [calendarData, fill, startCell, endCell],
    )

    const contiguousSlots: ContiguousSlot[] = useMemo(() => {
        const contiguousSlots = []
        for (let j = 0; j < columns; j++) {
            let startIndex = -1
            for (let i = 0; i < rows; i++) {
                if (isSelected(i, j) && startIndex === -1) {
                    startIndex = i
                }
                if (!isSelected(i, j) && startIndex !== -1) {
                    contiguousSlots.push({
                        dayOfWeek: j,
                        beginIndex: startIndex,
                        endIndex: i - 1,
                    })
                    startIndex = -1
                }
            }
            if (startIndex !== -1) {
                contiguousSlots.push({
                    dayOfWeek: j,
                    beginIndex: startIndex,
                    endIndex: rows - 1,
                })
            }
        }
        return contiguousSlots
    }, [isSelected])

    props.setGetContiguousSlots(
        useCallback(() => contiguousSlots, [contiguousSlots]),
    )

    const slotLabels = useMemo(
        () =>
            finishedRender
                ? contiguousSlots.map((slot, idx) => {
                      const day = days[slot.dayOfWeek]
                      const beginTime = timestamps[slot.beginIndex]
                      const endTime = timestamps[slot.endIndex + 1]

                      const referenceBounds =
                          referenceRef.current!.getBoundingClientRect()
                      const topBounds =
                          refs.current[slot.beginIndex][
                              slot.dayOfWeek
                          ]!.getBoundingClientRect()
                      const bottomBounds =
                          refs.current[slot.endIndex][
                              slot.dayOfWeek
                          ]!.getBoundingClientRect()

                      const top = topBounds.top - referenceBounds.top - 2
                      const left = topBounds.left - referenceBounds.left - 0.5
                      const width = topBounds.width
                      const height = bottomBounds.bottom - topBounds.top

                      const numSlots = slot.endIndex - slot.beginIndex + 1

                      return (
                          <motion.div
                              key={idx}
                              className={`absolute z-10 ${
                                  numSlots > 1 ? "p-2" : "px-2 py-1"
                              } pointer-events-none`}
                              style={{
                                  top,
                                  left,
                                  width,
                                  height,
                              }}
                              variants={itemVariants}
                          >
                              <div className="flex flex-col items-center justify-center bg-emerald-700 text-white border border-white rounded-md w-full h-full">
                                  {numSlots > 2 && (
                                      <span className="font-semibold">
                                          {day}
                                      </span>
                                  )}
                                  <span className="text-xs">
                                      {beginTime} - {endTime}
                                  </span>
                              </div>
                          </motion.div>
                      )
                  })
                : [],
        [contiguousSlots, referenceRef, finishedRender],
    )

    return (
        <motion.div
            className="table-container w-full relative overflow-x-hidden"
            variants={mainVariants}
            ref={referenceRef}
            onAnimationComplete={() => setFinishedRender(true)}
        >
            {slotLabels}
            <table
                className="calendar-table"
                cellSpacing={0}
                cellPadding={0}
                onMouseLeave={() => {
                    setDragging(false)
                    commitSelection()
                }}
                onMouseUp={() => {
                    setDragging(false)
                    commitSelection()
                }}
                onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}
            >
                <thead>
                    <motion.tr variants={itemVariants}>
                        <th className="w-[25%]"></th>
                        {days.map((day) => (
                            <th className="w-[15%]" key={day}>
                                {day}
                            </th>
                        ))}
                    </motion.tr>
                </thead>
                <tbody>
                    {calendarData.map((row, i) => (
                        <motion.tr variants={itemVariants} key={i}>
                            <th>{`${timestamps[i]} - ${timestamps[i + 1]}`}</th>
                            {row.map((_, j) => {
                                const selected = isSelected(i, j)
                                const lastSelected = !(
                                    isSelected(i + 1, j) ?? true
                                )

                                return (
                                    <td
                                        key={j}
                                        ref={setRef(i, j)}
                                        onMouseDown={() => {
                                            setDragging(true)
                                            setFill(
                                                !calendarData[i][j].selected,
                                            )
                                            setStartCell([i, j])
                                            setEndCell([i, j])
                                        }}
                                        onMouseEnter={() => {
                                            if (
                                                dragging &&
                                                startCell[1] === j
                                            ) {
                                                setEndCell([i, j])
                                            }
                                        }}
                                        title={`${days[j]} ${timestamps[i]} - ${
                                            timestamps[i + 1]
                                        }`}
                                        className={`${
                                            selected
                                                ? "selected"
                                                : "not-selected"
                                        } ${
                                            selected && lastSelected
                                                ? "selected-last"
                                                : ""
                                        } transition-colors`}
                                    ></td>
                                )
                            })}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    )
}

export default EditableCalendar
