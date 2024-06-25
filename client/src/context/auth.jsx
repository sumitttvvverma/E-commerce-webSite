import {useState, useEffect, useContext, createContext, Children } from "react";

const AuthContext = createContext();        //step 1


const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({      //step 5
      user: null,
      token: '',
    });
  
    useEffect(()=>{
        const data = localStorage.getItem('auth')
        if(data){
            const parseData = JSON.parse(data)
            setAuth({
                ...auth,
                user:parseData.user,
                token:parseData.token
            })  //private.jsx will run depends on its
        }
        //eslint-disable-next-line
    },[])

    return (
       //step 2
       //step 4 wrap <App/> in main.jsx by AuthProvider 
      <AuthContext.Provider value={[ auth, setAuth ]}>  
        {children}
      </AuthContext.Provider>
    );
  }

const useAuth=()=>useContext(AuthContext)   //step 3    coustom hook

export {useAuth,AuthProvider}