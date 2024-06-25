import React from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/Search'

const Search = () => {
    const [values,setValues]=useSearch();

  return (
    <Layout title={'Search Result'}>
        <div className="container">
            <div className="text-center">
                <h1>Search Result</h1>
                <h6>{values?.results.length < 1 ? 'No products Found' : `Found ${values?.results.length}`}</h6>
               
                <div className="d-flex flex-wrap mt-4">
                {values?.results.map((p)=>(
                  
                   <div className="card m-2" style={{width: '18rem'}} key={p._id}>
                    {/* directly taking photo using src from getPhotoController*/}
                    <img src={`http://localhost:7050/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                        <div className="card-body ">
                          <h5 className="card-title d-flex">{p.name}</h5>
                          <p className="card-text d-flex">{p.description.substring(0,20)}...</p>
                          <p className="card-text d-flex">$ {p.price}</p>
                          <button className='btn btn-outline-primary ms-1'>More Details</button>
                          <button className='btn btn-outline-secondary ms-1'>Add to Cart</button>
                        </div>
                    </div>
                 
                ))}
              </div>
            </div>
        </div>
    </Layout>
  )
}

export default Search