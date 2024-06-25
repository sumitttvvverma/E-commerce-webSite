import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const Products = () => {
  const [products,setProducts]=useState([])
  
  //get all products
  const getAllProducts = async()=>{
    try {
      const res = await axios.get('http://localhost:7050/api/v1/product/get-product');
      if (res.data.success) {
      setProducts(res.data.products);
      }
    } catch (error) {
      console.log(error)
      toast.error("something went wrong")
    }
  }

  //lifeCycle method
  useEffect(()=>{
    getAllProducts();
  },[])

  return (
    <Layout title="Products - Ecommer App">
      <div className="container-fluid m-3 p-3">
       <div className="row">
          <div className="col-md-3">
          <AdminMenu/>
          </div>
          <div className="col-md-9">
           <div className="text-center">All Products List</div>
           <div className="d-flex flex-wrap">
                {products?.map((p)=>(
                  <Link key={p._id} to={`/dashboard/admin/update-product/${p.slug}`} className='product-link'>
                   <div className="card m-2" style={{width: '18rem'}} >
                    {/* directly taking photo using src from getPhotoController*/}
                    <img src={`http://localhost:7050/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt="..." />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">{p.description}</p>
                      </div>
                    </div>
                  </Link>   
                ))}
           </div>
          </div>
       </div>
      </div> 
    </Layout>
  )
}

export default Products