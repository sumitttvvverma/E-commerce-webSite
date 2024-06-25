import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate,Link,useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import '../../styles/AuthStyles.css';
import { useAuth } from "../../context/auth";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [auth,setAuth]=useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:7050/api/v1/auth/login", {
        email,
        password,
      });
      console.log("res", res,"& res.data" ,res.data )
      if (res && res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user : res.data.user,
          token : res.data.token,
        });
        localStorage.setItem('auth',JSON.stringify(res.data))
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("res login catcherror",error); //when asending inputs empty and wrong it comes 
      toast.error(error.response.data.message);
    }
  };
  return (
    <Layout title="login - Ecommer App">
      <div className="form-container login" >
        
        <form className="card p-3" onSubmit={handleSubmit} style={{width:'33%'}}>
        
          <div className="mb-3">
            <label style={{display:'flex'}} htmlFor="inputEmail4" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="inputEmail4"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label style={{display:'flex'}} htmlFor="inputPassword4" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="inputPassword4"
              name="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between" style={{margin:8}}>
            <p>New user? <Link to="/register">Register</Link></p>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </div>
          <div className="mt-1">
            <button
              type="button"
              className="btn forgot-btn"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot Password
            </button>
          </div>

      
        </form>
      </div>
    </Layout>
  );
};

export default Login;