import React,{useEffect,useState} from 'react'
import {useAuth} from '../../context/auth'
import {Outlet} from 'react-router-dom'
import axios from 'axios'
import Spinner from '../Spinner'

const AdminRoute = () => {
  const [ok,setOk]=useState(false);
  const [auth,setAuth]=useAuth()

  useEffect(()=>{
    const authCheck =async()=>{
      const res = await axios.get('http://localhost:7050/api/v1/auth/admin-auth',{
        headers:{
          "Authorization":auth?.token
        }
      })
      // console.log(res);
      // console.log(auth?.token)  //token only
      if(res.data.ok){
        setOk(true)
      }else{
        setOk(false)
      }
    };
    // If there is an authentication token, run the authCheck function
    if(auth?.token){
      authCheck();
    }
  },[auth?.token])  // Run this effect whenever the token changes

  return ( //yhah nested routing k liye Outlet pass krna pdta h
    <>
     {ok ? <Outlet/> : <Spinner path=""/>  } 
    </>
  )
}

export default AdminRoute