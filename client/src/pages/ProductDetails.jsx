import React,{useEffect,useState} from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams , useNavigate } from 'react-router-dom'
import '../styles/ProductDetailsStyles.css'

const ProductDetails = () => {
    const params = useParams();
    const navigate=useNavigate();
    const [product,setProduct]=useState([]);
    const [relatedProducts,setRelatedProducts]=useState([]);

    //get click product
    const getProduct=async()=>{
        try {
            const res = await axios.get(`http://localhost:7050/api/v1/product/get-product/${params.slug}`)
            // console.log(res)
            setProduct(res.data?.product);
            getRelatedProduct(res.data?.product._id,res.data?.product.category._id);
        } catch (error) {
            console.log(error)   
        }
    }
    // intial P details 
    useEffect(()=>{
        if(params?.slug) getProduct();
    },[params?.slug])

    // get similar product 
    const getRelatedProduct=async(pid,cid)=>{
        try {
            const res = await axios.get(`http://localhost:7050/api/v1/product/related-product/${pid}/${cid}`);
            // console.log(res)
            setRelatedProducts(res.data?.products)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    // when someone click on more details button
    <Layout>
        {/* <h1>Product Details</h1> */}
        {/* {JSON.stringify(product)} */}
        <div className="row container product-details">
            <div className="col-md-6">
                {/* directly taking photo using src from getPhotoController*/}
                <img src={`http://localhost:7050/api/v1/product/product-photo/${product._id}`} className="card-img-top" alt={product.name} 
                height={'300px'} width={'300px'} />
            </div>
            <div className="col-md-6 product-details-info">
                <h1 className='text-center'>Product Details</h1>
                <h6>Name : {product.name}</h6>
                <h6>Description : {product.description}</h6>
                <h6>Price :$ {product.price}</h6>
                <h6>Category : {product?.category?.name}</h6>
                <button className='btn btn-outline-secondary ms-1' style={{width:150}}>Add to Cart</button>
            </div>
        </div>
        <hr/>
        {/* ye next row m hogi */}
        <div className="row container similar-products">
            <h1>similar products</h1>
            {relatedProducts.length < 1 && <p className='text-center'>No Products Found</p>}
            <div className="d-flex flex-wrap">
                {relatedProducts?.map((p)=>(
                  
                   <div className="card m-2" style={{width: '18rem'}} key={p._id}>
                    {/* directly taking photo using src from getPhotoController*/}
                    <img src={`http://localhost:7050/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                        <div className="card-body ">
                          <h5 className="card-title d-flex">{p.name}</h5>
                          <p className="card-title card-price">$ {p.price}</p>
                          <p className="card-text d-flex">{p.description.substring(0,20)}...</p>
                          <div className="card-name-price">
                          <button className='btn btn-outline-primary ms-1' onClick={()=> navigate(`/product/${p.slug}`)}>More Details</button>
                          </div>
                          {/* <button className='btn btn-outline-secondary ms-1'>Add to Cart</button> */}
                        </div>
                    </div>
                 
                ))}
              </div>
        </div>


    </Layout>
  )
}

export default ProductDetails