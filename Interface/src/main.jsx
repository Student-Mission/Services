import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./styles/Fonts.css";
import "./styles/Fonts.scss";
import "./styles/Colors.scss";
import "./i18n.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
