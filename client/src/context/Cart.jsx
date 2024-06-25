import {useState,  useContext, createContext , useEffect } from "react";

const CartContext = createContext();       

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
  
    useEffect(()=>{
      let existingCartItem = localStorage.getItem('cart') //just for previous adding cart items in JS value<>JSON data
      if(existingCartItem){
        setCart(JSON.parse(existingCartItem))   //in JS obj
      }
    },[])

    return (
      <CartContext.Provider value={[ cart, setCart ]}>  
        {children}
      </CartContext.Provider>
    );
  }

const useCart=()=>useContext(CartContext)   

export { useCart , CartProvider };