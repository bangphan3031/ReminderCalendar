import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import { ContextProvider } from './contexts/ContextProvider.jsx'
import { AppProvider } from './contexts/AppContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
    <ContextProvider>
      <AppProvider>
        <RouterProvider router={router}/>
      </AppProvider>
    </ContextProvider>
  //</React.StrictMode>,
)
