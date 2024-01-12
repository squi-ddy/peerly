import React from "react"
import { createRoot } from "react-dom/client"
import {
    BrowserRouter,
    createBrowserRouter,
    Router,
    RouterProvider,
} from "react-router-dom"
import BasePage from "./components/BasePage"
import "./index.css"
import App from "./App"

createRoot(document.getElementById("mount") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)
