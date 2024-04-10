import { AnimatePresence } from "framer-motion"
import { cloneElement } from "react"
import { Outlet, useLocation, useRoutes } from "react-router-dom"
import BasePage from "./base/BasePage"
import MainPage from "./pages/MainPage"
import MotionBase from "./base/MotionBase"
import Page404 from "./pages/Page404"
import AuthPage from "./pages/AuthPage"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import TutorsPage from "./pages/TutorsPage"
import LearnersPage from "./pages/LearnersPage"
import LessonsPage from "./pages/LessonsPage"
import AboutPage from "./pages/AboutPage"
import ProfilePage from "./pages/ProfilePage"
import TutorSetupPage from "./pages/TutorSetupPage"
import LearnerSetupPage from "./pages/LearnerSetupPage"

function App() {
    const location = useLocation()

    const element = useRoutes([
        {
            path: "/",
            element: <MainPage />,
        },
        {
            path: "/tutors",
            element: <TutorsPage />,
        },
        {
            path: "/about",
            element: <AboutPage />,
        },
        {
            path: "/learners",
            element: <LearnersPage />,
        },
        {
            path: "/lessons",
            element: <LessonsPage />,
        },
        {
            path: "/me",
            element: <ProfilePage />,
        },
        {
            path: "/auth",
            element: <AuthPage />,
            children: [
                {
                    path: "register",
                    element: <RegisterForm />,
                },
                {
                    index: true,
                    element: <LoginForm />,
                },
            ],
        },
        {
            path: "/setup",
            element: <Outlet />,
            children: [
                {
                    path: "tutor",
                    element: <TutorSetupPage />,
                },
                {
                    path: "learner",
                    element: <LearnerSetupPage />,
                },
            ],
        },
        {
            path: "*",
            element: <Page404 />,
        },
    ])

    if (!element) return null

    return (
        <BasePage>
            <AnimatePresence mode="wait">
                <MotionBase key={location.pathname.split("/")[1]}>{element}</MotionBase>
            </AnimatePresence>
        </BasePage>
    )
}

export default App
