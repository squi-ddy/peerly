import { AnimatePresence } from "framer-motion"
import { useLocation, useRoutes } from "react-router-dom"
import BasePage from "./base/BasePage.js"
import MotionBase from "./base/MotionBase.js"
import LoginForm from "./components/LoginForm.js"
import RegisterForm from "./components/RegisterForm.js"
import AboutPage from "./pages/AboutPage.js"
import AuthPage from "./pages/AuthPage.js"
import LearnerSetupPage from "./pages/LearnerSetupPage.js"
import LearnersPage from "./pages/LearnersPage.js"
import LessonsPage from "./pages/LessonsPage.js"
import MainPage from "./pages/MainPage.js"
import Page404 from "./pages/Page404.js"
import ProfilePage from "./pages/ProfilePage.js"
import TutorSetupPage from "./pages/TutorSetupPage.js"
import RequestTutelagePage from "./pages/RequestTutelagePage.js"
import RequestsPage from "./pages/RequestsPage.js"

const routes = [
    {
        path: "/",
        element: <MainPage />,
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
        path: "/request",
        element: <RequestTutelagePage />,
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
        path: "/options/tutor",
        element: <TutorSetupPage />,
    },
    {
        path: "/options/learner",
        element: <LearnerSetupPage />,
    },
    {
        path: "/setup/tutor",
        element: <TutorSetupPage />,
    },
    {
        path: "/setup/learner",
        element: <LearnerSetupPage />,
    },
    {
        path: "/requests",
        element: <RequestsPage />,
    },
    {
        path: "*",
        element: <Page404 />,
    },
]

const routeKeys = {
    "/": "main",
    "/about": "about",
    "/learners": "learners",
    "/lessons": "lessons",
    "/me": "profile",
    "/auth": "auth",
    "/auth/register": "auth",
    "/options/tutor": "tutorOptions",
    "/options/learner": "learnerOptions",
    "/setup/tutor": "tutorSetup",
    "/setup/learner": "learnerSetup",
    "/request": "request",
    "/requests": "requests",
} as Record<string, string | undefined>

function App() {
    const location = useLocation()

    const element = useRoutes(routes)

    if (!element) return null

    return (
        <BasePage>
            <AnimatePresence mode="wait">
                <MotionBase key={routeKeys[location.pathname] ?? "404"}>
                    {element}
                </MotionBase>
            </AnimatePresence>
        </BasePage>
    )
}

export default App
