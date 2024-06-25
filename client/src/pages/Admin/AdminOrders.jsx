import React,{useEffect,useState} from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from '../../context/auth';
import moment from 'moment';

import { Select } from "antd";
const {Option}=Select;

const AdminOrders = () => {
    const [status,setStatus] = useState(["Not Process", "Processing", "Shipped", "deliverd", "cancel"]);
    const [changeStatus,setChangeStatus] = useState("");
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();

  //all orders by admin  
  const getOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:7050/api/v1/auth/all-orders', {
        headers: {
          Authorization: auth?.token,
        },
      });
    //   console.log("Orders received from backend:", data.orders);
      setOrders(data.orders); // Accessing the orders array correctly
    } catch (error) {
    //   console.log("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);
  
  // to update status 
  const handleChange=async(orderId,value)=>{
    try {
      const {data} = await axios.put(`http://localhost:7050/api/v1/auth/order-status/${orderId}`,{
        status:value
      },{
        headers: {
          Authorization: auth?.token,
        },
      })
      getOrders();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders.length > 0 ? (
              orders.map((o, i) => (
                <div key={i} className="border shadow mb-3">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Buyer</th>
                        <th scope='col'>Date</th>
                        <th scope='col'>Payment</th>
                        <th scope='col'>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        {/* Only changes in Status by Select */}
                        <td>
                            <Select variant={false} onChange={(value)=>handleChange(o._id,value)} defaultValue={o?.status}
                            >
                              {status.map((s,i)=>(
                                <Option key={i} value={s}></Option>
                              ))}
                            </Select>
                        </td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                  {
                    o?.products?.map((p,i)=>(
                      <div className="row m-1 card flex-row" key={p._id}>
                        <div className="col-md-4  mb-1 mt-1">
                            <img src={`http://localhost:7050/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name}
                            width={"100px"} height={"100px"} />
                        </div>
                        <div className="col-md-8 mb-1">
                          <p className='d-flex'>{p.name}</p>
                          <p className='d-flex'>{p.description.substring(0,30)}</p>
                          <p className='d-flex'>Price :{p.price}</p>
                        </div>
                      </div> 
                      ))
                   }
                  </div>
                </div>
              ))
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
