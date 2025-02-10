import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// HTML의 id가 "root"인 요소에 React 앱을 렌더링합니다.
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
