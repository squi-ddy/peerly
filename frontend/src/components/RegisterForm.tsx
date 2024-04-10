import SetTitle from "./SetTitle"
import { useCallback, useContext, useRef } from "react"
import MotionButton from "./MotionButton"
import { register } from "@/api"
import { useNavigate } from "react-router-dom"
import { UserContext } from "@/base/BasePage"
import FormNumberInput from "./forms/FormNumberInput"
import FormTextInput from "./forms/FormTextInput"
import FormPasswordInput from "./forms/FormPasswordInput"
import FormCheckboxInput from "./forms/FormCheckboxInput"
import {
    InputErrorFunction,
    InputFunctionContainer,
    InputFunctionItems,
} from "@/types/FormDefinition"
import { IUserCreate } from "@backend/types/user"

const itemVariants = {
    hidden: { transform: "translateY(-20px)", opacity: 0 },
    visible: { transform: "translateY(0)", opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.01 } },
}

const fieldNames = [
    "studentId",
    "username",
    "email",
    "password",
    "confirmPassword",
    "class",
    "tutor",
    "learner",
] as const

const defaultInputContainer = {
    studentId: {
        submitFunc: () => "",
        errorFunc: () => "",
        value: "",
    } as InputFunctionItems<string>,
    password: {
        submitFunc: () => "",
        errorFunc: () => "",
        value: "",
    } as InputFunctionItems<string>,
    username: {
        submitFunc: () => "",
        errorFunc: () => "",
        value: "",
    } as InputFunctionItems<string>,
    email: {
        submitFunc: () => "",
        errorFunc: () => "",
        value: "",
    } as InputFunctionItems<string>,
    confirmPassword: {
        submitFunc: () => "",
        errorFunc: () => "",
        value: "",
    } as InputFunctionItems<string>,
    class: {
        submitFunc: () => 101,
        errorFunc: () => "",
        value: 101,
    } as InputFunctionItems<number>,
    tutor: {
        submitFunc: () => false,
        errorFunc: () => "",
        value: false,
    } as InputFunctionItems<boolean>,
    learner: {
        submitFunc: () => false,
        errorFunc: () => "",
        value: false,
    } as InputFunctionItems<boolean>,
} satisfies InputFunctionContainer<typeof fieldNames>

function RegisterForm() {
    const inputContainer = useRef(defaultInputContainer)

    const setSubmitFunction = useCallback(
        (key: keyof typeof defaultInputContainer) => {
            return (
                func: (typeof defaultInputContainer)[typeof key]["submitFunc"],
            ) => {
                inputContainer.current[key]["submitFunc"] = func
            }
        },
        [],
    )

    const setErrorFunction = useCallback(
        (key: keyof typeof defaultInputContainer) => {
            return (func: InputErrorFunction) => {
                inputContainer.current[key]["errorFunc"] = func
            }
        },
        [],
    )

    const currYear = new Date().getFullYear() % 100

    const navigate = useNavigate()

    const { updateUser } = useContext(UserContext)

    return (
        <>
            <SetTitle title="Register" />

            <FormTextInput
                fieldName="studentId"
                fieldPlaceholder="Student ID"
                variants={itemVariants}
                setSubmitFunction={setSubmitFunction("studentId")}
                setErrorFunction={setErrorFunction("studentId")}
                checker={(value: string) => {
                    if (!value)
                        return {
                            success: false,
                            message: "Student ID is required",
                        }
                    if (!/^h\d{7}$/i.test(value)) {
                        return {
                            success: false,
                            message:
                                "Invalid Student ID, should match hXXXXXXX",
                        }
                    }
                    return { success: true }
                }}
            />

            <FormTextInput
                fieldName="username"
                fieldPlaceholder="Username"
                variants={itemVariants}
                setSubmitFunction={setSubmitFunction("username")}
                setErrorFunction={setErrorFunction("username")}
                z={"z-[-1]"}
                checker={(value: string) => {
                    if (!value)
                        return {
                            success: false,
                            message: "Username is required",
                        }
                    if (value.length > 255) {
                        return {
                            success: false,
                            message: "Username is too long",
                        }
                    }
                    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                        return {
                            success: false,
                            message:
                                "Username can only contain letters, numbers, and underscores",
                        }
                    }
                    return { success: true }
                }}
            />

            <FormTextInput
                fieldName="email"
                fieldPlaceholder="Email"
                type="email"
                fieldValue=""
                z={"z-[-2]"}
                variants={itemVariants}
                setErrorFunction={setErrorFunction("email")}
                setSubmitFunction={setSubmitFunction("email")}
                checker={(value: string) => {
                    if (!value)
                        return {
                            success: false,
                            message: "Email is required",
                        }
                    if (value.length > 255) {
                        return {
                            success: false,
                            message: "Email is too long",
                        }
                    }
                    return { success: true }
                }}
            />

            <FormPasswordInput
                fieldName="password"
                fieldPlaceholder="Password"
                z={"z-[-3]"}
                variants={itemVariants}
                setErrorFunction={setErrorFunction("password")}
                setSubmitFunction={setSubmitFunction("password")}
                checker={(value: string) => {
                    if (!value)
                        return {
                            success: false,
                            message: "Password is required",
                        }
                    if (value.length < 8) {
                        return {
                            success: false,
                            message: "Password is too short",
                        }
                    }
                    if (value.length > 255) {
                        return {
                            success: false,
                            message: "Password is too long",
                        }
                    }
                    return { success: true }
                }}
            />

            <FormPasswordInput
                fieldName="confirmPassword"
                fieldPlaceholder="Confirm Password"
                setErrorFunction={setErrorFunction("confirmPassword")}
                setSubmitFunction={setSubmitFunction("confirmPassword")}
                z={"z-[-4]"}
                variants={itemVariants}
            />

            <FormNumberInput
                fieldName="class"
                fieldPlaceholder={`M${currYear}`}
                fieldValue={101}
                min={101}
                max={699}
                setSubmitFunction={setSubmitFunction("class")}
                setErrorFunction={setErrorFunction("class")}
                z="z-[-5]"
                variants={itemVariants}
                checker={(value: number) => {
                    if (value < 101 || value > 699)
                        return {
                            success: false,
                            message: "Invalid class",
                        }
                    return { success: true }
                }}
            />

            <FormCheckboxInput
                fieldName="tutor"
                fieldPlaceholder="Tutor?"
                z="z-[-6]"
                setSubmitFunction={setSubmitFunction("tutor")}
                setErrorFunction={setErrorFunction("tutor")}
                variants={itemVariants}
            />

            <FormCheckboxInput
                fieldName="learner"
                fieldPlaceholder="Learner?"
                z="z-[-7]"
                setSubmitFunction={setSubmitFunction("learner")}
                setErrorFunction={setErrorFunction("learner")}
                variants={itemVariants}
            />

            <MotionButton
                text="Next"
                variants={itemVariants}
                onClick={async () => {
                    let anyNulls = false
                    for (const field of fieldNames) {
                        const value = inputContainer.current[field].submitFunc()
                        if (value === null) {
                            anyNulls = true
                            continue
                        }
                        inputContainer.current[field].value = value
                    }
                    if (anyNulls) return
                    const studentId = inputContainer.current.studentId.value
                    const username = inputContainer.current.username.value
                    const email = inputContainer.current.email.value
                    const password = inputContainer.current.password.value
                    const confirmPassword =
                        inputContainer.current.confirmPassword.value
                    const studentClass3Digit =
                        inputContainer.current.class.value
                    const isTutor = inputContainer.current.tutor.value
                    const isLearner = inputContainer.current.learner.value
                    if (password !== confirmPassword) {
                        inputContainer.current.confirmPassword.errorFunc(
                            "Passwords do not match",
                        )
                        return
                    }
                    if (!isTutor && !isLearner) {
                        inputContainer.current.tutor.errorFunc(
                            "You must be a tutor or a learner",
                        )
                        return
                    }
                    const year = Math.floor(studentClass3Digit / 100)
                    const studentClass = currYear * 1000 + studentClass3Digit
                    const data: IUserCreate = {
                        "student-id": studentId,
                        username,
                        email,
                        password,
                        year,
                        class: studentClass,
                        "is-tutor": isTutor,
                        "is-learner": isLearner,
                    }

                    console.log(data)

                    const res = await register(data)
                    if (!res.success) {
                        const message = res.response!.data!.message
                        if (message === "Validation error") {
                            const errors: string[] = res.response!.data!.errors
                            for (const field of fieldNames) {
                                for (const errorField of errors) {
                                    if (errorField.includes(field)) {
                                        inputContainer.current[field].errorFunc(
                                            "Unknown error",
                                        )
                                    }
                                }
                            }
                        } else if (message === "User already exists") {
                            inputContainer.current.studentId.errorFunc(
                                "User already exists",
                            )
                        } else {
                            alert(`Unknown error ${message}`)
                        }
                    } else {
                        await updateUser()
                        if (isTutor) {
                            navigate("/setup/tutor", { state: { learner: isLearner }})
                        } else {
                            navigate("/setup/learner")
                        }
                    }
                }}
                textSize="text-xl"
                z="z-[-8]"
                layout
            />
        </>
    )
}

export default RegisterForm
