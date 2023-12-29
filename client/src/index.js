import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { store } from './app/store'
import { Provider } from 'react-redux'

import { ThemeProvider } from '@mui/material/styles';
import {theme} from './config/theme'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
              <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
