import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import {GiShoppingBag} from 'react-icons/gi'
import { useAuth } from '../../context/auth'
import { toast } from 'react-toastify'
import SearchInput from '../Form/SearchInput.jsx'
import useCategory from '../../hooks/useCategory.jsx'   //custom hook used
import { useCart } from '../../context/Cart.jsx'
import {Badge} from 'antd';

const Header = () => {
  const [cart]=useCart();
  const [auth,setAuth]=useAuth();
  const categories=useCategory();

  const handleLogout=()=>{
    setAuth({
      ...auth, user:null , token :""
    })
    localStorage.removeItem('auth')
    toast.success('Logout successfully')
  }

  return (
    <>
    {/* Navlink and to added and replaced with a */}
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
      {/* Link import only for first One so NavLink default css will not active on it */}
      <Link to='/' className="navbar-brand " style={{font:"icon"}} >
        {/* between 2 things(icon,div) give space using margin-1 without parentClass distract coz display flex of parent*/}
       <GiShoppingBag className='m-1'/>  <div className='m-1'>E-commerce App</div>
        </Link>

      {/* me auto replaced with ms auto  marginEnd marginStart*/}
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0"> 
        
        <SearchInput/>

        <li className="nav-item">
          <NavLink to='/' className="nav-link "  >Home</NavLink>
        </li>

      {/* category dropdown for maping categories in dropdown-item using custom hook */}
        <li className="nav-item dropdown">
          <Link to={'/categories'} href="" className="nav-link dropdown-toggle"  data-bs-toggle="dropdown" aria-expanded="false">
            Categories
          </Link>
          <ul className="dropdown-menu">
          <li className='dropdown-item' ><NavLink to={`/categories`} className=" nav-link">All Categories</NavLink></li>

               {categories?.map((c)=>(
                <li className='dropdown-item' key={c._id} ><NavLink to={`/category/${c.slug}`} className=" nav-link">{c.name}</NavLink></li>
                ))}
          </ul>
        </li>
        
        {/* ternery operator */}
      {
        !auth.user ? 
        (<>   <li className="nav-item"><NavLink to='/register' className="nav-link"  >Register</NavLink></li>
              <li className="nav-item"><NavLink to='/login' className="nav-link"  >Login</NavLink></li> 
        </>)  
        : (<>
            
            <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
             {auth?.user.name}
            </Link>
           <ul className="dropdown-menu dropdown-menu">
            {/* understand it for same name btn but diff route */}
            <li className="dropdown-item"> <NavLink  to={`/dashboard/${auth?.user.role ===1 ? "admin" : "user"}`} className="nav-link">DashBoard</NavLink></li> 
            <li className="dropdown-item"> <NavLink onClick={handleLogout} to="/login" className="nav-link">Logout</NavLink></li> 
          </ul>
            </li>

          </>) 
      }
        <li className="nav-item">
          <Badge count={cart?.length} >
            <NavLink to='/cart' className="nav-link"  >
              Cart 
            </NavLink>
          </Badge>
        </li>
      </ul>
    
    </div>
  </div>
</nav>
    </>
  )
}

export default Header