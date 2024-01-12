import { AnimatePresence, motion } from "framer-motion"
import { cloneElement } from "react"
import { useLocation, useRoutes } from "react-router-dom"
import BasePage from "./components/BasePage"
import MainPage from "./components/MainPage"

function App() {
    const element = useRoutes([
        {
            path: "/",
            element: (
                <BasePage title="Peerly">
                    <MainPage />
                </BasePage>
            ),
        },
        {
            path: "/login",
            element: (
                <BasePage title="Login">
                    <div className="grow text-xl text-center">Login page</div>
                </BasePage>
            ),
        },
        {
            path: "*",
            element: (
                <BasePage title="404">
                    <div className="grow text-xl text-center">
                        This page doesn&#39;t exist
                    </div>
                </BasePage>
            ),
        },
    ])

    const location = useLocation()

    if (!element) return null

    return (
        <AnimatePresence mode="wait">
            {cloneElement(element, { key: location.pathname })}
        </AnimatePresence>
    )
}

export default App
