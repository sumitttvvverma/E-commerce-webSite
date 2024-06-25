import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:7050/api/v1/auth/orders', {
        headers: {
          Authorization: auth?.token,
        },
      });
      console.log("Orders received from backend:", data.orders);
      setOrders(data.orders); // Accessing the orders array correctly
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  return (
    <Layout title={'Your Orders'}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className='text-center'>All orders</h1>
            {/* <p>{JSON.stringify(orders,null,4)}</p> */}
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
                        <td>{o?.status}</td>
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

export default Orders;
