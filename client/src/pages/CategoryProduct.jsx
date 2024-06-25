import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { useParams ,useNavigate } from 'react-router-dom';
import { useCart } from '../context/Cart';
import { toast } from 'react-toastify';
import "../styles/CategoryProductStyles.css"

const CategoryProduct = () => {
  const [cart,setCart]=useCart();
  const params = useParams();
  const navigate=useNavigate();
  const [products,setProducts]=useState([]);
  const [category,setCategory]=useState([]);

  //for each category when we clicked
  useEffect(()=>{
   if(params?.slug) getProductByCat();
  },[params?.slug]);
  const getProductByCat =async()=>{
    try {
      const res = await axios.get(`http://localhost:7050/api/v1/product/product-category/${params.slug}`);
      setProducts(res.data?.products);
      setCategory(res.data?.category);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Layout>
      <div className="container mt-3 category">
        <h4 className='text-center'>Category-{category?.name}</h4>
        <h2 className='text-center'>{products?.length} result found</h2>


        <div className="d-flex flex-wrap">
                {products?.map((p)=>(
                  
                   <div className="card m-2" style={{width: '18rem'}} key={p._id}>
                    {/* directly taking photo using src from getPhotoController*/}
                    <img src={`http://localhost:7050/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                        <div className="card-body ">
                          <div className="card-name-price">
                            <h5 className="card-title d-flex">{p.name}</h5>
                            <p className="card-title card-price">$ {p.price}</p>
                          </div>
                          <h5 className="card-text d-flex">{p.description.substring(0,20)}...</h5>
                          <div className="card-name-price">
                            <button className='btn btn-outline-primary ms-1' onClick={()=> navigate(`/product/${p.slug}`)}>More Details</button>
                            <button className='btn btn-outline-secondary ms-1' 
                            onClick={()=>{
                              setCart([...cart,p])
                              localStorage.setItem('cart',JSON.stringify([...cart,p]))
                              toast.success('item edit to cart')
                            }}>Add to Cart</button>
                          </div>
                        </div>
                    </div>
                 
                ))}
              </div>
      </div>
    </Layout>
  )
}

export default CategoryProduct