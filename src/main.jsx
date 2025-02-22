import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import MedContextProvider from './context/MedContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MedContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </MedContextProvider>
  </StrictMode>,
)
