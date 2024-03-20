import { AnimatePresence } from "framer-motion"
import { cloneElement, useEffect, useRef, useState } from "react"
import { useLocation, useRoutes } from "react-router-dom"
import BasePage from "./components/BasePage"
import MainPage from "./components/MainPage"
import MotionBase from "./components/MotionBase"
import Page404 from "./components/Page404"
import LoginRegister from "./components/LoginRegister"
import Login from "./components/Login"
import Register from "./components/Register"
import TutorsPage from "./components/TutorsPage"
import LearnersPage from "./components/LearnersPage"
import LessonsPage from "./components/LessonsPage"
import AboutPage from "./components/AboutPage"

function App() {
    const [renderState, setRenderState] = useState("0")
    const lastLocation = useRef([] as string[])

    const baseRouteDelayMap: { [key: string]: number } = {
        "0": 0.8,
    }

    const authRouteDelayMap: { [key: string]: number } = {
        "0": 1.9,
        "1": 1.2,
        "2": 0,
    }

    const element = useRoutes([
        {
            path: "/",
            element: (
                <MotionBase delay={baseRouteDelayMap[renderState]}>
                    <MainPage />
                </MotionBase>
            ),
        },
        {
            path: "/:name",
            element: (
                <MotionBase delay={baseRouteDelayMap[renderState]}>
                    <MainPage />
                </MotionBase>
            ),
        },
        {
            path: "/tutors",
            element: (
                <MotionBase delay={baseRouteDelayMap[renderState]}>
                    <TutorsPage />
                </MotionBase>
            ),
        },
        {
            path: "/about",
            element: (
                <MotionBase delay={baseRouteDelayMap[renderState]}>
                    <AboutPage />
                </MotionBase>
            ),
        },
        {
            path: "/learners",
            element: (
                <MotionBase delay={baseRouteDelayMap[renderState]}>
                    <LearnersPage />
                </MotionBase>
            ),
        },
        {
            path: "/lessons",
            element: (
                <MotionBase delay={baseRouteDelayMap[renderState]}>
                    <LessonsPage />
                </MotionBase>
            ),
        },
        {
            path: "/auth",
            element: (
                <MotionBase delay={baseRouteDelayMap[renderState]}>
                    <LoginRegister />
                </MotionBase>
            ),
            children: [
                {
                    path: "register",
                    element: (
                        <MotionBase
                            delay={authRouteDelayMap[renderState]}
                            layout
                        >
                            <Register />
                        </MotionBase>
                    ),
                },
                {
                    index: true,
                    element: (
                        <MotionBase
                            delay={authRouteDelayMap[renderState]}
                            layout
                        >
                            <Login />
                        </MotionBase>
                    ),
                },
            ],
        },
        {
            path: "*",
            element: (
                <MotionBase delay={baseRouteDelayMap[renderState]}>
                    <Page404 />
                </MotionBase>
            ),
        },
    ])

    const location = useLocation()

    useEffect(() => {
        const loc_split = location.pathname.split("/")
        const prev_loc_split = lastLocation.current
        let i
        for (
            i = 0;
            i < Math.min(loc_split.length, prev_loc_split.length);
            i++
        ) {
            if (loc_split[i] !== prev_loc_split[i]) {
                break
            }
        }
        setRenderState(i.toString())
        lastLocation.current = loc_split
    }, [location])

    if (!element) return null

    return (
        <BasePage>
            <AnimatePresence mode="wait">
                {cloneElement(element, {
                    key: location.pathname.split("/")[1],
                })}
            </AnimatePresence>
        </BasePage>
    )
}

export default App
