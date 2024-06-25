import {Routes,Route} from 'react-router-dom'

import HomePage from './pages/HomePage'
import About from './pages/About'
import Contact from './pages/Contact'
import Policy from './pages/Policy'
import PageNotFound from './pages/PageNotFound'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import ForgotPasssword from './pages/Auth/ForgotPassword'
import Dashboard from './pages/user/Dashboard'
import Private from './components/Routes/Private'
import AdminRoute from './components/Routes/AdminRoute'
import AdminDashboard from './pages/Admin/AdminDashboard'
import CreateCategory from './pages/Admin/CreateCategory'
import CreateProduct from './pages/Admin/CreateProduct'
import Products from './pages/Admin/Products'
import Profile from './pages/user/Profile'
import Orders from './pages/user/Orders'
import UpdateProduct from './pages/Admin/UpdateProduct'
import Search from './pages/Search'
import ProductDetails from './pages/ProductDetails'
import Categories from './pages/Categories'
import CategoryProduct from './pages/CategoryProduct'
import CartPage from './pages/CartPage'
import AdminOrders from './pages/Admin/AdminOrders'



function App() {
 
  return (
    <>
   
     <Routes>
     <Route path='/' element={<HomePage/>}/>
     <Route path='/search' element={<Search/>}/>
     <Route path='/product/:slug' element={<ProductDetails/>}/> 
     <Route path='/cart' element={<CartPage/>}/> 

      {/* nested Route */}
      <Route path='/dashboard' element={<Private/>} >
           <Route path='user' element={<Dashboard/>}/>
           <Route path='user/orders' element={<Orders/>}/>
           <Route path='user/profile' element={<Profile/>}/>
      </Route>
      <Route path='/dashboard' element={<AdminRoute/>}>
            <Route path='admin' element={<AdminDashboard/>}></Route>
            <Route path='admin/create-category' element={<CreateCategory/>}></Route>
            <Route path='admin/create-product' element={<CreateProduct/>}></Route>
            <Route path='admin/update-product/:slug' element={<UpdateProduct/>}></Route>
            <Route path='admin/products' element={<Products/>}></Route>
            <Route path='admin/orders' element={<AdminOrders/>}></Route>
      </Route>

      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/policy' element={<Policy/>}/>
      <Route path='/categories' element={<Categories/>}/>
      <Route path='/category/:slug' element={<CategoryProduct/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/forgot-password' element={<ForgotPasssword/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/*' element={<PageNotFound/>}/>
     </Routes>
    
    </>
  )
}

export default App
