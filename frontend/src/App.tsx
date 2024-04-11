import { AnimatePresence } from "framer-motion"
import { Outlet, useLocation, useRoutes } from "react-router-dom"
import BasePage from "./base/BasePage"
import MotionBase from "./base/MotionBase"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import AboutPage from "./pages/AboutPage"
import AuthPage from "./pages/AuthPage"
import LearnerSetupPage from "./pages/LearnerSetupPage"
import LearnersPage from "./pages/LearnersPage"
import LessonsPage from "./pages/LessonsPage"
import MainPage from "./pages/MainPage"
import Page404 from "./pages/Page404"
import ProfilePage from "./pages/ProfilePage"
import TutorSetupPage from "./pages/TutorSetupPage"

function App() {
    const location = useLocation()

    const element = useRoutes([
        {
            path: "/",
            element: <MainPage />,
        },
        {
            path: "/tutor",
            element: <TutorSetupPage />,
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
            path: "/options",
            element: (
                <AnimatePresence mode="wait">
                    <MotionBase key={location.pathname.split("/")[2]}>
                        <Outlet />
                    </MotionBase>
                </AnimatePresence>
            ),
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
            path: "/setup",
            element: (
                <AnimatePresence mode="wait">
                    <MotionBase key={location.pathname.split("/")[2]}>
                        <Outlet />
                    </MotionBase>
                </AnimatePresence>
            ),
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
                <MotionBase key={location.pathname.split("/")[1]}>
                    {element}
                </MotionBase>
            </AnimatePresence>
        </BasePage>
    )
}

export default App
