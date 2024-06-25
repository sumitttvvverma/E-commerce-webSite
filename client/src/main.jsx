import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/auth.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css'; // Import Ant Design styles
import { SearchProvider } from './context/Search.jsx'
import { CartProvider } from './context/Cart.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
        <ToastContainer position="top-left" theme='colored' newestOnTop autoClose={3000}/>    
     <React.StrictMode>  
        <AuthProvider>
            <SearchProvider>
               <CartProvider>
                  <App />
               </CartProvider>
            </SearchProvider>      
        </AuthProvider>
     </React.StrictMode>
  </BrowserRouter>
    
)
