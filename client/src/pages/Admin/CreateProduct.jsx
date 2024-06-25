import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Select } from 'antd';

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState(null);
  const [shipping, setShipping] = useState("");
  const [data, setData] = useState({
    name: "", description: "", price: "", quantity: ""
  });

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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append('name', data.name);
      productData.append('description', data.description);
      productData.append('price', data.price);
      productData.append('quantity', data.quantity);
      productData.append('category', category);
      productData.append('photo', photo);
      productData.append('shipping', shipping);

      const res = await axios.post('http://localhost:7050/api/v1/product/create-product', 
        productData,
        {
          headers: {
            Authorization: auth?.token,
          }
        }
      );

      if (res.data?.success) {
        toast.success('Product created successfully');
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
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Create-Product - Ecommerce App">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h3>Create Product</h3>
            {/* categories selections */}
            <div className="m-1 w-75">
              <Select
                placeholder="Select a category"
                size='large'
                showSearch
                className='form-select mb-3'
                onChange={(value) => { setCategory(value) }}
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
                {photo && (
                  <div className="text-center">
                    <img src={URL.createObjectURL(photo)} alt="product_photo" height={"200px"} className='img img-responsive' />
                  </div>
                )}
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
                  onChange={(value) => { setShipping(value) }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className='btn btn-primary' onClick={handleCreate}>CREATE PRODUCT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
