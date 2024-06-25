//remainder this is better then login of its project
import React, { useState } from "react";
import { Link ,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import '../../styles/AuthStyles.css';

const Register = () => {
  const [data, setData] = useState({ name: "", email: "", password: "", address: "", phone: "" , answer:""});

  const navigate=useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting data:", data);
      const res = await axios.post("http://localhost:7050/api/v1/auth/register", data);
      console.log("Response received:", res);
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } 
  
  // Backend-frontend integration code here
  }
  

  return (
    <>
      <Layout title="Register - Ecommerce App">
            
          <div className="form-container">
            <form className="card p-3" onSubmit={handleSubmit} style={{width:"37%"}}>
              <div className="mb-2">
                <label style={{display:'flex'}} htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={handleChange} required
                />
              </div>
              <div className="mb-2">
                <label style={{display:'flex'}} htmlFor="inputEmail4" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail4"
                  name="email"
                  value={data.email}
                  onChange={handleChange} required
                />
              </div>
              <div className="mb-2">
                <label style={{display:'flex'}} htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={data.address}
                  onChange={handleChange} required
                />
              </div>
              <div className="mb-2">
                <label style={{display:'flex'}} htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="number"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange} required
                />
              </div>
              <div className="mb-2">
                <label style={{display:'flex'}} htmlFor="phone" className="form-label">What's your favorite Sport</label>
                <input
                  type="text"
                  className="form-control"
                  id="answer"
                  name="answer"
                  value={data.answer}
                  onChange={handleChange} required
                />
              </div>
              <div className="mb-2">
                <label style={{display:'flex'}} htmlFor="inputPassword4" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="inputPassword4"
                  name="password"
                  value={data.password}
                  onChange={handleChange} required
                />
              </div>
              <div className="d-flex justify-content-between" style={{ margin: 8 }}>
                <p>Already Registered? <Link to="/login">Login</Link></p>
                <div className="mb-2">
                  <button type="submit" className="btn btn-primary">Register</button>
                </div>
              </div>
            </form>
          </div>
        
      </Layout>
    </>
  );
};

export default Register;
