import React from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css"
import { LoginPage } from './pages/loginPage/loginPage'
import { HomePage } from './pages/navPage/homePage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
