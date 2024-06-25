import React,{useEffect,useState} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-toastify';
import axios from 'axios';
import CategoryForm from '../../components/Form/CategoryForm';
import { useAuth } from '../../context/auth';
import { Modal } from 'antd';

const CreateCategory = () => {
  const [auth,setAuth]=useAuth();

  const [categories, setCategories] = useState([])   //array for adding multiple values
  const [name ,setName]=useState('')

  const [visible,setVisible]=useState(false);   //antd
  const [selected,setSelected]=useState(null);
  const [updatedName,setUpdatedName]=useState("");

  //handle form created
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:7050/api/v1/category/create-category',
        { name },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (res.data.success) {
        console.log(res);
        toast.success(`${name} is created`);
        getAllCategory();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong in input form');
    }
  };


  //get all categories
  const getAllCategory=async()=>{
    try {
      const res = await axios.get('http://localhost:7050/api/v1/category/get-category');
      if(res.data.success){
        console.log("getAllCategory >> ",res)
        setCategories(res.data.getCategory);
      }
    } catch (error) {
      console.log(error);
      toast.error('something went wrong in getting category')
    }
  }

  useEffect(()=>{
    getAllCategory();
  },[])

  //update category
  const handleUpdateSubmit=async(e)=>{
    e.preventDefault();
    try {
      const res = await axios.patch(`http://localhost:7050/api/v1/category/update-category/${selected._id}`,
        { name:updatedName },
        {
          headers: {
            Authorization: auth?.token,
          },
        });
        if(res.data.success){
          toast.success(`${updatedName} is updated`)
          //reset all
          setSelected(null)
          setUpdatedName("")
          setVisible(false)
          getAllCategory();
        }else{
          toast.error(res.data.message)
        }
    } catch (error) {
      console.log(error)
      toast.error("something went wrong in update")
    }
  }

  //delete category
  const handleDeleteSubmit=async(pId)=>{
    try {
      const answer =window.prompt("Are u sure u want to delete")
      if(!answer) return;
      const res = await axios.delete(`http://localhost:7050/api/v1/category/delete-category/${pId}`,
        {
          headers: {
            Authorization: auth?.token,
          },
        });
        if(res.data.success){
          toast.success(`category is deleted`)
          getAllCategory();
        }else{
          toast.error(res.data.message)
        }
    } catch (error) {
      console.log(error)
      toast.error("something went wrong in delete")
    }
  }  

  return (
    <Layout title="CreateCategory - Ecommerce App">
    <div className="container-fluid m-3 p-3">
     <div className="row">
        <div className="col-md-3">
        <AdminMenu/>
        </div>
        <div className="col-md-9">
        <h3>Manage Category</h3>
          <div className="w-75">
            <div className="p-3 w-90">
              <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName}/>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((c)=> (
                    <tr key={c._id}>
                      <td >{c.name}</td>
                      <td>
                        <button className='btn btn-primary ms-2' onClick={()=>{
                        setVisible(true); 
                        setUpdatedName(c.name);
                        setSelected(c);
                        }}
                          >Edit
                        </button>
                        <button className='btn btn-danger ms-2' onClick={()=>{handleDeleteSubmit(c._id)}}>Delete</button>
                      </td>
                    </tr>
                  )
                ) }
              </tbody>
            </table>
          </div>        
          {/* footer null bs data hai react library ka */}
          <Modal onCancel={()=>setVisible(false)} footer={null} open={visible}>
            {/* for update name */}
          <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdateSubmit}/>
          
          </Modal>
        </div>
     </div>
    </div> 
  </Layout>
  )
}

export default CreateCategory