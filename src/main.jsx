import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import "./styles/theme.css";
import "./styles/typography.css";
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')).render(
    <App />
)
