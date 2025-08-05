import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// react-router-dom importuna artık burada gerek yok
// import { BrowserRouter } from 'react-router-dom'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter> etiketlerini buradan kaldır */}
    <App />
  </React.StrictMode>
);  