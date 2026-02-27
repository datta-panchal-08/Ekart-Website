import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { persistor, store } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import {ToastContainer} from 'react-toastify'
import Modal from "react-modal";

Modal.setAppElement("#root");

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
        <ToastContainer/>
      </PersistGate>
    </Provider>
  </React.StrictMode>

)
