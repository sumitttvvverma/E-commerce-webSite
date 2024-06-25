import { useState,useEffect } from "react";
import axios from "axios";

//custom hooks
export default function useCategory() {
    const [categories,setCategories]=useState([]);

    //get cat
   const getCategories =async()=>{
        try {
            const res = await axios.get(`http://localhost:7050/api/v1/category/get-category`)
            setCategories(res.data?.getCategory)
        } catch (error) {
            console.log(error)
        }
   }
   useEffect(()=>{
    getCategories()
   },[]);

  return categories;
}

 