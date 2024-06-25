import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
    //context
    const [auth,setAuth]=useAuth();
    //state
    const [data, setData] = useState({ name: "", email: "", password: "", address: "", phone: "" });
    
    //get login user data
    useEffect(()=>{
        // console.log(auth?.user)
        const {name,email,address,phone}=auth?.user;
        setData({
            name : name || "",  //for a warning was given by chrome
            email:email|| "",
            password:"",
            address:address||"",
            phone:phone||""
        });
        
    },[auth?.user]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        //   console.log("Submitting data:", data);
          const res = await axios.put("http://localhost:7050/api/v1/auth/profile",
            data,{
                headers: {
                  Authorization: auth?.token,
                }} 
        );
            //   console.log("Response received:", res);
            if(res.data?.success){
                setAuth({...auth, user:res.data?.updateUser})
                let ls=localStorage.getItem('auth')
                ls=JSON.parse(ls)   //convert in JS obj
                ls.user=res.data.updateUser
                localStorage.setItem('auth',JSON.stringify(ls)) //JS obj into json strings
                toast.success("Profile Update successfully")
            }else{
                toast.error(res.data?.error)
            }
          
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        } 
      }

  return (
    <Layout title={'You Profile'}>
    <div className="container-fluid m-3 p-3">
        <div className="row">
            <div className="col-md-3">
                <UserMenu/>
            </div>
            <div className="col-md-9">
                    <div className="form-container">
                        <form className="card p-3" onSubmit={handleSubmit} style={{width:"37%"}}>
                            <h4 className="title">USER PROFILE</h4>
                            <div className="mb-2">
                                <label style={{display:'flex'}} htmlFor="name" className="form-label">Name</label>
                                <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={handleChange} 
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
                                onChange={handleChange}  disabled
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
                                onChange={handleChange} 
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
                                onChange={handleChange} 
                                />
                            </div>
                            <div className="mb-2">
                                <label style={{display:'flex'}} htmlFor="inputPassword4" className="form-label">Update Password</label>
                                <input
                                type="password"
                                className="form-control"
                                id="inputPassword4"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                />
                            </div>
                            <div className="mb-1">
                            <button type="submit" className="btn btn-primary">UPDATE</button>
                            </div>
                        </form>
                  </div>
            </div>
        </div>
    </div>
</Layout>
  )
}

export default Profile