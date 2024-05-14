import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.js'; // 拡張子を追加
import reportWebVitals from './reportWebVitals.js'; // 拡張子を追加

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
