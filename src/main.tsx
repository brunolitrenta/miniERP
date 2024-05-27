import React from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css"
import { LoginPage } from './pages/loginPage/loginPage'
import { HomePage } from './pages/navPage/homePage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { CurrentUserContextProvider } from './hooks/currentUserContext';
import { DataContextProvider } from './hooks/dataContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <CurrentUserContextProvider>
      <HomePage />
    </CurrentUserContextProvider>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataContextProvider>
      <RouterProvider router={router} />
    </DataContextProvider>
  </React.StrictMode>,
)
