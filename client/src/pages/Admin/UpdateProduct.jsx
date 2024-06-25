import React,{ useEffect, useState }  from 'react'
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/auth';
import { useNavigate , useParams } from 'react-router-dom';
import {Select } from 'antd'

const { Option } = Select;

const UpdateProduct = () => {

    const params = useParams();
    const navigate = useNavigate();
    const [auth] = useAuth();
  
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");  
    const [photo, setPhoto] = useState(null);
    const [shipping, setShipping] = useState("");
    const [data, setData] = useState({
      name: "", description: "", price: "", quantity: ""
      });
    const [id,setId]=useState(""); //for getting id separate for getting photo  

    //get single product  
    const getSingleProduct = async()=>{
        try {
            const res = await axios.get(`http://localhost:7050/api/v1/product/get-product/${params.slug}`);
            if(res.data.success){
                // console.log("product",res.data.product)
                setData(res.data.product) //name,description,price,quantity fetch ho jaygi
                setId(res.data.product._id)
                setCategory(res.data.product.category._id)  //for getting previous category with id to pass id to id
                setShipping(res.data.product.shipping); //  for shipping Select component
            }else{
                toast.error("something went wrong in fetch single product")
            }
        } catch (error) {
            console.log("single product error = ",error)
        }
    }
    useEffect(()=>{
        getSingleProduct();
        //eslint-disable-next-line
    },[]);
  
    //get all categories
    const getAllCategory = async () => {
      try {
        const res = await axios.get('http://localhost:7050/api/v1/category/get-category');
        if (res.data.success) {
        //   console.log("getAllCategory >> ", res);
          setCategories(res.data.getCategory);
        }
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong in getting category');
      }
    };
  
    useEffect(() => {
      getAllCategory();
    }, []);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
    };
  
    //update product
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const productData = new FormData();
        productData.append('name', data.name);
        productData.append('description', data.description);
        productData.append('price', data.price);
        productData.append('quantity', data.quantity);
        productData.append('category', category);
        photo && productData.append('photo', photo);
        productData.append('shipping', shipping);
  
        const res = await axios.put(`http://localhost:7050/api/v1/product/update-product/${id}`, 
          productData,
          {
            headers: {
              Authorization: auth?.token,
            }
          }
        );
  
        if (res.data?.success) {
          toast.success('Product updated successfully');
          setData({ name: "", description: "", price: "", quantity: "" });
          setCategory("");
          setPhoto(null);  // Reset photo state to null
          setShipping("");
          navigate('/dashboard/admin/products');
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong in update");
      }
    };

    //delete product
    const handleDelete=async(req,res)=>{
      try {
        const answer =window.prompt("Are u sure u want to delete")
        if(!answer) return;
        const res = await axios.delete(`http://localhost:7050/api/v1/product/delete-product/${id}`,
          {
            headers: {
              Authorization: auth?.token,
            }
          }
        )
        if(res.data.success){
          toast.success('Product deleted successfully');
          navigate('/dashboard/admin/products');
        }
      } catch (error) {
        console.log(error)
        toast.error("Something went wrong in delete")
      }
    }

  return (
    <Layout title="Create-Product - Ecommerce App">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h3>Update Product</h3>
            {/* categories selections */}
            <div className="m-1 w-75">
              <Select
                placeholder="Select a category"
                size='large'
                showSearch
                className='form-select mb-3'
                onChange={(value) => { setCategory(value) }}
                // only in update below by taking from state
                value={category}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              {/* for image , 'image/*'= png jpg koi b type kaimage chelga */}
              <div className="mb-3">
                <label className='btn btn-outline-secondary col-md-12'>
                  {photo ? photo.name : "Upload Image"}
                  <input type="file" name="photo" accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                </label>
              </div>
              <div className="mb-3">
                {/* chnages for update */}
                {photo ? (
                  <div className="text-center">
                    <img src={URL.createObjectURL(photo)} alt="product_photo" height={"200px"} className='img img-responsive' />
                  </div>
                ) : (
                  <div className="text-center">
                    {/* this id comes from new state create here for getting photo/id */}
                  <img src={`http://localhost:7050/api/v1/product/product-photo/${id}`} alt="product_photo" height={"200px"} className='img img-responsive' />
                </div>
                ) }
              </div>
              <div className="mb-3">
                <input type="text" value={data.name} placeholder='Write a name' name='name' className='form-control' onChange={handleChange} />
              </div>
              <div className="mb-3">
                <input type="text" value={data.description} placeholder='Write a description' name='description' className='form-control' onChange={handleChange} />
              </div>
              <div className="mb-3">
                <input type="number" value={data.price} placeholder='Write a price' name='price' className='form-control' onChange={handleChange} />
              </div>
              <div className="mb-3">
                <input type="number" value={data.quantity} placeholder='Write a quantity' name='quantity' className='form-control' onChange={handleChange} />
              </div>
              {/* for shipping  */}
              <div className="mb-3">
                <Select
                  placeholder="Shipping"
                  size='large'
                  showSearch
                  className='form-select mb-3'
                  onChange= {(value) => { setShipping(value) }}
                // only in update below
                  value= { shipping ? "yes" : "No" }
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className='btn btn-primary' onClick={handleUpdate}>UPDATE PRODUCT</button>
              </div>
              <div className="mb-3">
                <button className='btn btn-outline-danger' onClick={handleDelete}>DELETE PRODUCT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UpdateProduct