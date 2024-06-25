import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Checkbox,Radio } from 'antd'
import { Price } from '../components/Prices'
import { useNavigate } from 'react-router-dom'
import {useCart} from '../context/Cart'
import '../styles/Homepage.css'
import banner from '../images/banner.png'

const HomePage = () => {
  const [cart,setCart]=useCart();
  const navigate = useNavigate();
  const [categories,setCategories]=useState([]);
  const [products,setProducts]=useState([]);
  const [checked,setChecked] = useState([]);  //for categories filter
  const [radio,setRadio] = useState([]);    //for price filter
  const [total,setTotal]=useState(0);       
  const [page,setPage]=useState(1);  
  const [loading,setLoading]=useState(false)       

  
  //get all categories
  const getAllCategory = async () => {
    try {
      const res = await axios.get('http://localhost:7050/api/v1/category/get-category');
      if (res.data.success) {
        // console.log("getAllCategory >> ", res);
        setCategories(res.data.getCategory);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong in getting category');
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //then> get all products & now > product per page (for loadmore working)
  const getAllProducts = async()=>{
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:7050/api/v1/product/product-list/${page}`);
      setLoading(false)
      if (res.data.success) {
      // console.log(res.data)  
      setProducts(res.data.products);
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error("something went wrong")
    }
  }

  //lifeCycle method
  useEffect(()=>{
   if(!checked.length || !radio.length){
    getAllProducts();
   }  
   
  },[])

  //load more
  const loadMore = async()=>{
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:7050/api/v1/product/product-list/${page}`)
      setLoading(false)
      setProducts([...products,...res.data?.products])
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  useEffect(()=>{
    if(page===1) return;
      loadMore();
  },[page])

  //getTotal count
  const getTotal=async()=>{
    try {
      const res = await axios.get('http://localhost:7050/api/v1/product/product-count')
      setTotal(res.data?.total)
    } catch (error) {
      console.log(error)
    }
  }


  //filter for category
  const handleFilter=async(value,id)=>{
    let all =[...checked];
    if(value){
      all.push(id);  //push : add one or more element to the end of the array and return new length of array
    }else{
      all = all.filter(cId=>cId!==id)   //filter: array method that creates a new array with all elements that 'pass' the test
          //cId=checked ID of all       //test: if cID not equal id -> it will include in new array , if equal then exclude from new array
          //supoose men, kids were checked and want to remove men then menId is equal to all ki menId so it will exclude from all Now only kid remains
    }
    setChecked(all);
  }
  
  //get filterd product by backend
  const filterProduct= async()=>{
    try {
      const res = await axios.post('http://localhost:7050/api/v1/product/product-filters',{checked,radio})
      setProducts(res.data?.products)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
   if(checked.length || radio.length) filterProduct()
  },[checked,radio])

  return (
    
    <Layout title={"All products Best Offers"}>
      {/* banner image */}
      <img
        src={banner}
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      {/* banner image */}
    <div className="container-fluid row mt-2 home-page">
       <div className="row">
          <div className="col-md-3 filters">
                {/* categories filter */}
                <h4 className='text-center'>Filter By Category</h4>
                <div className="d-flex flex-column">
                  {categories?.map((c)=>(
                    //for categories filter & for checked state
                    <Checkbox key={c._id} onChange={(e)=>handleFilter(e.target.checked ,c._id)}>
                      {c.name}
                    </Checkbox>
                  ))}
                </div>
                 {/* price filter    */}
                <h4 className='text-center mt-4'>Filter By Price</h4>
                <div className="d-flex flex-column">
                  <Radio.Group onChange={(e)=>setRadio(e.target.value)}>
                    {Price?.map((p)=>(
                      <div className='d-flex' key={p._id}>
                        <Radio value={p.array}>{p.name}</Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>
                <div className="d-flex flex-column">
                  {/* reload to page by window function */}
                 <button className='btn btn-danger w-50 m-2' onClick={()=>window.location.reload()}>RESET FILTERS</button>
                </div>
          </div>
          <div className="col-md-9">
            {/* {JSON.stringify(checked,null,4)}
            {JSON.stringify(radio,null,4)} */}
            <h1 className="text-center">All products</h1>
              <div className="d-flex flex-wrap">
                {products?.map((p)=>(
                  
                   <div className="card m-2"  key={p._id}>
                    {/* directly taking photo using src from getPhotoController*/}
                    <img src={`http://localhost:7050/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                        <div className="card-body ">
                          <div className="card-name-price">
                            <h5 className="card-title d-flex">{p.name}</h5>
                            <h5 className="card-text d-flex">$ {p.price}</h5>
                          </div>
                          <p className="card-text d-flex">{p.description.substring(0,20)}...</p>
                          <div className="card-name-price">
                            <button className='btn btn-info ms-1' onClick={()=> navigate(`/product/${p.slug}`)}>More Details</button>
                            <button className='btn btn-dark ms-1'
                            onClick={()=>{
                              setCart([...cart,p])
                              localStorage.setItem('cart',JSON.stringify([...cart,p]))
                              toast.success('item edit to cart')
                            }} >Add to Cart
                            </button>
                          </div>
                        </div>
                    </div>
                 
                ))}
              </div>
              
              <div className='btn loadmore m-2 p-3'>
                {products && products.length < total && (
                  <button className='btn btn-warning' onClick={(e)=>{
                    e.preventDefault();
                    setPage(page+1);
                  }}>
                    {loading ? 'Loading...':'Loadmore'}
                  </button>
                )}
              </div>
          </div>
        </div>
    </div> 
     </Layout>
    
  )
}

export default HomePage