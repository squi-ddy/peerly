import { settings } from "./settings"
import axios from "axios"
import { IUserMinimal, IUserFull } from "@backend/types/user"
import { isFullUser, isMinimalUser } from "./checkers"

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

export async function register(
    username: string,
    password: string,
    year: number,
) {
    try {
        const resp = {
            success: true,
            response: await axios.post(`${settings.API_URL}/acct/signup`, {
                username,
                password,
                year,
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
