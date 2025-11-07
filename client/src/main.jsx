import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js'; // Your Redux store

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provides the Redux store to your entire app */}
    <Provider store={store}>
      {/* Handles all the app's routing (pages) */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
