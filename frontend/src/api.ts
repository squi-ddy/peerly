import { settings } from "./settings"
import axios from "axios"

export async function login(username: string, password: string) {
    try {
        return {
            success: true,
            response: await axios.post(`${settings.API_HOST}/acct/login`, {
                username,
                password,
            }),
        }
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
    year: number
) {
    try {
        return {
            success: true,
            response: await axios.post(`${settings.API_HOST}/acct/signup`, {
                username,
                password,
                year,
            }),
        }
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            throw error
        }
        return { success: false, response: error.response }
    }
}
