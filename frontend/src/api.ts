import {
    ISubject,
    ITutorSubject,
    ITutorSubjectCreate,
    ITutorSubjectGet,
} from "@backend/types/subject"
import { IUserCreate, IUserFull, IUserMinimal } from "@backend/types/user"
import axios from "axios"
import {
    isEmptyTimeslotArray,
    isFullUser,
    isMinimalUser,
    isSubjectArray,
    isTutorSubjectArray,
} from "./checkers"
import { settings } from "./settings"
import {
    IEmptyTimeslot,
    IEmptyTimeslotCreate,
    IEmptyTimeslotGet,
} from "@backend/types/timeslot"

axios.defaults.withCredentials = true

let currentUser: IUserMinimal | null | undefined = undefined

export async function login(studentId: string, password: string) {
    try {
        const resp = {
            success: true,
            response: await axios.post(`${settings.API_URL}/acct/login`, {
                studentId,
                password,
            }),
        }
        currentUser = undefined // force refresh
        return resp
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            throw error
        }
        return { success: false, response: error.response }
    }
}

export async function register(data: IUserCreate) {
    try {
        const resp = {
            success: true,
            response: await axios.post(`${settings.API_URL}/acct/signup`, data),
        }
        currentUser = undefined // force refresh
        return resp
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            throw error
        }
        return { success: false, response: error.response }
    }
}

export async function logout() {
    try {
        const resp = {
            success: true,
            response: await axios.post(`${settings.API_URL}/acct/logout`),
        }
        currentUser = null
        return resp
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            throw error
        }
        return { success: false, response: error.response }
    }
}

export async function getCurrentSession(): Promise<IUserMinimal | null> {
    if (currentUser !== undefined) {
        return currentUser
    }
    try {
        const response = await axios.get(`${settings.API_URL}/acct/session`)
        const data = response.data
        if (!isMinimalUser(data)) {
            throw new Error("Invalid user data")
        }
        currentUser = data
        return currentUser
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            throw error
        }
        currentUser = null
        return null
    }
}

export async function getCurrentProfile(): Promise<IUserFull | null> {
    try {
        const response = await axios.get(`${settings.API_URL}/acct/me`)
        const data = response.data
        if (!isFullUser(data)) {
            throw new Error("Invalid user data")
        }
        return data
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            throw error
        }
        return null
    }
}

export async function getSubjects(): Promise<ISubject[] | null> {
    try {
        const response = await axios.get(`${settings.API_URL}/subjects/all`)
        const data = response.data
        if (!isSubjectArray(data)) {
            throw new Error("Invalid subject data")
        }
        return data
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            throw error
        }
        return null
    }
}

export async function sendSubjects(data: ITutorSubjectCreate[]) {
    try {
        const resp = {
            success: true,
            response: await axios.post(
                `${settings.API_URL}/subjects/submitTutor`,
                data,
            ),
        }
        return resp
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            throw error
        }
        return { success: false, response: error.response }
    }
}

export async function sendEmptyTimeslots(data: IEmptyTimeslotCreate[]) {
    try {
        const resp = {
            success: true,
            response: await axios.post(
                `${settings.API_URL}/timeslots/setEmpty`,
                data,
            ),
        }
        return resp
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            throw error
        }
        return { success: false, response: error.response }
    }
}

export async function getEmptyTimeslots(
    data: IEmptyTimeslotGet,
): Promise<IEmptyTimeslot[] | null> {
    try {
        const resp = await axios.get(`${settings.API_URL}/timeslots/getEmpty`, {
            params: data,
        })
        const respData = resp.data
        if (!isEmptyTimeslotArray(respData)) {
            throw new Error("Invalid timeslot data")
        }
        return respData
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            throw error
        }
        return null
    }
}

export async function getTutorSubjects(
    data: ITutorSubjectGet,
): Promise<ITutorSubject[] | null> {
    try {
        const resp = await axios.get(`${settings.API_URL}/subjects/getTutor`, {
            params: data,
        })
        const respData = resp.data
        if (!isTutorSubjectArray(respData)) {
            throw new Error("Invalid tutor subject data")
        }
        return respData
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            throw error
        }
        return null
    }
}
