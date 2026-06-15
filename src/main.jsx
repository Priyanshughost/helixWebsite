import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import "./styles/theme.css";
import "./styles/typography.css";
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import ReactLenis from 'lenis/react';

createRoot(document.getElementById('root')).render(
    <ReactLenis root options={{ lerp: 0.07, duration: 1.2, smoothWheel: true }}>
        <App />
    </ReactLenis>
)
