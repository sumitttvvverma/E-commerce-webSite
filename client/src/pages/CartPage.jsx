import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import { useCart } from '../context/Cart'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import { toast } from 'react-toastify'
import "../styles/CartStyles.css";

const CartPage = () => {
  const [cart,setCart] = useCart();
  const [auth,setAuth] = useAuth();
  const navigate= useNavigate();
  const [clientToken,setClientToken]=useState("");
  const [instance,setInstance]=useState("");
  const [loading,setLoading]=useState(false);

  // get Payment gateway token
  const getToken=async()=>{
    try {
      const res = await axios.get('http://localhost:7050/api/v1/product/braintree/token');
      setClientToken(res.data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
   getToken();
  }, [auth?.token]);
  
//handle payment
  const handlePayment=async()=>{
    try {
      setLoading(true)
      const {nonce}=await instance.requestPaymentMethod();
      const {data}=await axios.post('http://localhost:7050/api/v1/product/braintree/payment',{
        nonce,cart
      },{
        headers: {
          Authorization: auth?.token,
        }
      })
      setLoading(false)
      localStorage.removeItem('cart')
      setCart([])
      navigate('/dashboard/user/orders')
      toast.success('Payment complete successfully')
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }


  //Total price
  const totalPrice=()=>{
    try {
      let total =0;
      cart?.map((item)=>{
        total=total+item.price
      });
      return total.toLocaleString('en-US',{
        style:'currency',
        currency:"USD"
      });
    } catch (error) {
      console.log(error)
    }
  }

  //remove item
  const removeCartItem=(pId)=>{
    try {
      let myCart =[...cart];
          myCart = myCart.filter(item=>item._id !== pId)
          setCart(myCart);
          localStorage.setItem('cart',JSON.stringify(myCart)); //OnCLick p remove for localStorage by set it with update myCart
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
        <div className="cart-page">
          <div className="row">
            <div className="col-md-12">
              <h1 className='text-center bg-light p-2 mb-1'>
                {`Hello ${auth?.token && auth?.user?.name}`}
              </h1>
              <h4 className='text-center'>
                {/* nested ternery op */}
                {cart?.length  ? `you have ${cart?.length} items in your cart ${
                  auth?.token ? "" : "Please login to checkout"}`
                  :"Your cart is empty"}
              </h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 p-0 m-0">
                 {
                   cart?.map(p=>(
                    <div className="row m-1 card flex-row" key={p._id}>
                      <div className="col-md-4  mb-1 mt-1">
                          <img src={`http://localhost:7050/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name}
                          width={"100px"} height={"100px"} />
                      </div>
                        <div className="col-md-4 mb-1">
                        <p className='d-flex'>{p.name}</p>
                        <p className='d-flex'>{p.description.substring(0,30)}</p>
                        <p className='d-flex'>Price :{p.price}</p>
                        </div>
                        <div className="col-md-4 cart-remove-btn">
                        <button className='btn btn-danger d-flex' 
                        onClick={()=> removeCartItem(p._id)}
                        >Remove</button>
                        </div>
                   </div> 
                  ))
                 } 
            </div>
            <div className="col-md-4 cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | checkout | payment</p>
              <hr/>
              <h4>Total : {totalPrice()}</h4>
              {auth?.user?.address ? (
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button className='btn btn-outline-warning'
                  onClick={()=>navigate('/dashboard/user/profile' )}
                  >Update Address</button>
                </div>
              ) : (
                <div className="mb-3">
                  {
                    auth?.token ? (
                      <button className='btn btn-outline-warning' onClick={()=>navigate('/dasboard/user/profile')} >Update Address</button>
                    ):(
                      <button className='btn btn-outline-warning' onClick={()=>navigate('/login' ,
                    {  state:'/cart' } ) //agr yaha se login krte h to is page pr redirect honge state se
                      }>Please Login to checkout</button>
                    )
                  }
                </div>
              )}
              <div className="mt-2">
              {!clientToken || !cart?.length ? ("") : (
                   <>
                   <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: 'vault'
                        }
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <button className="btn btn-primary" onClick={handlePayment} disabled={!instance || loading || !auth?.user?.address}>
                    {loading ? 'Processing...' : 'Make Payment'}
                    </button>
                </>
                  )}
              </div>
            </div>
          </div>
        </div>
    </Layout>
  )
}

export default CartPage