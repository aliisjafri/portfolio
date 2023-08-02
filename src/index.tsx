import React from 'react'
import { createRoot } from 'react-dom/client'
const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
