import { getCurrentProfile } from "@/api"
import { UserContext } from "@/base/BasePage"
import MotionButton from "@/components/MotionButton"
import SetTitle from "@/components/SetTitle"
import FormCheckboxInput from "@/components/forms/FormCheckboxInput"
import FormNumberInput from "@/components/forms/FormNumberInput"
import FormPasswordInput from "@/components/forms/FormPasswordInput"
import FormTextInput from "@/components/forms/FormTextInput"
import {
    InputFunctionContainer,
    InputFunctionItems,
} from "@/types/FormDefinition"
import { IUserFull } from "@backend/types/user"
import { LayoutGroup, motion } from "framer-motion"
import { ReactNode, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

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
            staggerChildren: 0.05,
            duration: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: { when: "afterChildren", staggerChildren: 0.01 },
    },
}

const fieldNames = [
    "username",
    "email",
    "password",
    "confirmPassword",
    "class",
    "tutor",
    "learner",
] as const

const defaultInputContainer = {
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

function ProfilePageRow(props: { title: string; children: ReactNode }) {
    return (
        <motion.tr variants={itemVariants} layout>
            <th className="w-1/3 py-2">{props.title}</th>
            <td className="w-2/3 py-2">
                <div className="flex justify-center">{props.children}</div>
            </td>
        </motion.tr>
    )
}

function ProfilePage() {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const [profileData, setProfileData] = useState<IUserFull | undefined>(
        undefined,
    )

    const [edit, setEdit] = useState(false)

    // const inputContainer = useRef(defaultInputContainer)

    // const setSubmitFunction = useCallback(
    //     (key: keyof typeof defaultInputContainer) => {
    //         return (
    //             func: (typeof defaultInputContainer)[typeof key]["submitFunc"],
    //         ) => {
    //             inputContainer.current[key]["submitFunc"] = func
    //         }
    //     },
    //     [],
    // )

    // const setErrorFunction = useCallback(
    //     (key: keyof typeof defaultInputContainer) => {
    //         return (func: InputErrorFunction) => {
    //             inputContainer.current[key]["errorFunc"] = func
    //         }
    //     },
    //     [],
    // )

    useEffect(() => {
        if (!user) {
            navigate("/auth")
        } else
            getCurrentProfile().then((data) => {
                if (data) {
                    setProfileData(data)
                }
            })
    }, [user, navigate])

    if (!profileData) {
        return <></>
    }

    return (
        <>
            <SetTitle title="Profile" />
            <LayoutGroup>
                <motion.div
                    variants={itemVariants}
                    layout
                    className="mb-1 flex flex-row w-2/3"
                >
                    <motion.h1 variants={itemVariants} className="text-5xl">
                        Your Profile
                    </motion.h1>
                    <div className="grow" />
                    <MotionButton
                        text={edit ? "Save" : "Edit"}
                        textSize="text-2xl"
                        layout
                        onClick={() => {
                            if (edit) {
                                alert("submit")
                            }
                            setEdit(!edit)
                        }}
                    />
                </motion.div>
                <div className="h-4/5 w-full flex flex-col items-center">
                    <motion.div
                        className="table-container w-2/3"
                        variants={mainVariants}
                        layout
                    >
                        <table
                            className="vert-table text-2xl"
                            cellSpacing={0}
                            cellPadding={0}
                        >
                            <tbody>
                                <ProfilePageRow title="Student ID">
                                    <div className="h-14 flex items-center">
                                        {profileData["student-id"]}
                                    </div>
                                </ProfilePageRow>
                                <ProfilePageRow title="Username">
                                    <FormTextInput
                                        fieldName={"username"}
                                        fieldPlaceholder={""}
                                        width="w-1/2"
                                        edit={edit}
                                        fieldValue={profileData.username}
                                    />
                                </ProfilePageRow>
                                <ProfilePageRow title="Email">
                                    <FormTextInput
                                        fieldName={"email"}
                                        type={"email"}
                                        fieldPlaceholder={""}
                                        width="w-1/2"
                                        edit={edit}
                                        fieldValue={profileData.email}
                                    />
                                </ProfilePageRow>
                                {edit && (
                                    <>
                                        <ProfilePageRow title="Password">
                                            <FormPasswordInput
                                                width="w-1/2"
                                                fieldName="password"
                                                fieldPlaceholder="Password"
                                            />
                                        </ProfilePageRow>
                                        <ProfilePageRow title="Confirm Password">
                                            <FormPasswordInput
                                                width="w-1/2"
                                                fieldName="confirmPassword"
                                                fieldPlaceholder="Confirm Password"
                                            />
                                        </ProfilePageRow>
                                    </>
                                )}
                                <ProfilePageRow title="Class">
                                    <FormNumberInput
                                        fieldName={"class"}
                                        fieldPlaceholder={"M"}
                                        edit={edit}
                                        numberWidth="w-28"
                                        fieldValue={profileData.class}
                                    />
                                </ProfilePageRow>

                                <ProfilePageRow title="Year">
                                    <FormNumberInput
                                        fieldName={"year"}
                                        fieldPlaceholder={""}
                                        edit={edit}
                                        fieldValue={profileData.year}
                                    />
                                </ProfilePageRow>
                                <ProfilePageRow title="UUID">
                                    <div className="h-14 flex items-center">
                                        {profileData.uuid}
                                    </div>
                                </ProfilePageRow>
                                <ProfilePageRow title="Is Tutor?">
                                    <FormCheckboxInput
                                        fieldName={"isTutor"}
                                        fieldPlaceholder={""}
                                        width="w-1/2"
                                        edit={edit}
                                        fieldValue={profileData["is-tutor"]}
                                    />
                                </ProfilePageRow>
                                {edit && profileData["is-tutor"] && (
                                    <ProfilePageRow title="Edit Tutor Details">
                                        <MotionButton
                                            text="Save and Edit..."
                                            onClick={() => {
                                                // TODO: submit
                                                navigate("/options/tutor")
                                            }}
                                        />
                                    </ProfilePageRow>
                                )}
                                <ProfilePageRow title="Is Learner?">
                                    <FormCheckboxInput
                                        fieldName={"isLearner"}
                                        fieldPlaceholder={""}
                                        width="w-1/2"
                                        edit={edit}
                                        fieldValue={profileData["is-learner"]}
                                    />
                                </ProfilePageRow>
                                {edit && profileData["is-learner"] && (
                                    <ProfilePageRow title="Edit Learner Details">
                                        <MotionButton
                                            text="Save and Edit..."
                                            onClick={() => {
                                                // TODO: submit
                                                navigate("/options/learner")
                                            }}
                                        />
                                    </ProfilePageRow>
                                )}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </LayoutGroup>
        </>
    )
}

export default ProfilePage
