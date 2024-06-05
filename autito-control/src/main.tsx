
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CarControl from './components/CarControl';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CarControl />
  </React.StrictMode>,
);
