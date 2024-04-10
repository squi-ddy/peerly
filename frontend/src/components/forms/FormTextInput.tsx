import { AnimatePresence, Variants, motion } from "framer-motion"
import { useCallback, useRef, useState } from "react"
import {
    InputSubmitFunction,
    InputErrorFunction,
    InputCheckFunction,
} from "@/types/FormDefinition"
import { useFloating } from "@floating-ui/react"

const errorVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
}

function FormTextInput(props: {
    fieldName: string
    variants?: Variants
    checker?: InputCheckFunction<string>
    fieldPlaceholder: string
    fieldPrefix?: string
    fieldValue?: string
    edit?: boolean
    width?: string
    z?: string
    h?: string
    type?: string
    setSubmitFunction?: (getValue: InputSubmitFunction<string>) => void
    setErrorFunction?: (setError: InputErrorFunction) => void
}) {
    const { refs, floatingStyles } = useFloating({
        placement: "bottom",
    })
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const width = props.width ?? "w-5/6"
    const h = props.h ?? "h-14"
    const z = props.z ?? "z-0"
    const fieldValue = props.fieldValue ?? ""
    const type = props.type ?? "text"
    const checker =
        props.checker ??
        (useCallback(() => {
            return { success: true }
        }, []) as InputCheckFunction<string>)
    const setSubmitFunction =
        props.setSubmitFunction ?? useCallback(() => {}, [])
    const setErrorFunction = props.setErrorFunction ?? useCallback(() => {}, [])
    const edit = props.edit ?? true

    const submitFunction: InputSubmitFunction<string> = useCallback(() => {
        if (!edit) {
            return fieldValue
        }
        const value = inputRef.current!.value
        const check = checker(value)
        if (check.success) {
            setError(false)
            return value
        } else {
            setError(true)
            setErrorMessage(check.message)
            return null
        }
    }, [edit, fieldValue, checker])

    const errorFunction: InputErrorFunction = useCallback(
        (errorMessage: string) => {
            setError(true)
            setErrorMessage(errorMessage)
        },
        [],
    )

    setErrorFunction(errorFunction)
    setSubmitFunction(submitFunction)

    return (
        <motion.div
            variants={props.variants}
            key={props.fieldName + (edit ? "-edit" : "")}
            ref={refs.setReference}
            className={`min-w-0 ${h} ${width} ${z} ${
                edit ? "" : "flex items-center"
            }`}
            layout
        >
            {edit ? (
                <>
                    {props.fieldPrefix && (
                        <p className="text-2xl w-1/6 text-center min-w-0">
                            {props.fieldPrefix}
                        </p>
                    )}
                    <input
                        ref={inputRef}
                        type={type}
                        placeholder={props.fieldPlaceholder}
                        defaultValue={fieldValue}
                        onInput={() => {
                            setError(false)
                        }}
                        className={
                            "border-2 rounded-xl bg-transparent text-2xl w-full h-full p-2 text-center min-w-0 focus:border-sky-400 focus:outline-none transition-colors" +
                            (error ? " border-red-500" : "")
                        }
                    />
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.p
                                variants={errorVariants}
                                style={floatingStyles}
                                ref={refs.setFloating}
                                className="mt-2 text-l text-center border-white border bg-red-400 py-1 px-2 rounded-md"
                            >
                                {errorMessage}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <p className="text-2xl w-full text-center min-w-0">
                    {(props.fieldPrefix ?? "") + fieldValue}
                </p>
            )}
        </motion.div>
    )
}

export default FormTextInput
