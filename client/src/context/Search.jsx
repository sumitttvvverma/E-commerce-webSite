import {useState,  useContext, createContext } from "react";

const SearchContext = createContext();        //step 1


const SearchProvider = ({ children }) => {
    const [values, setValues] = useState({      //step 5
      keyword:"",
      results:[],
    });
  

    return (
       //step 2
       //step 4 wrap <App/> in main.jsx by SearchProvider 
      <SearchContext.Provider value={[ values, setValues ]}>  
        {children}
      </SearchContext.Provider>
    );
  }

const useSearch=()=>useContext(SearchContext)   //step 3    coustom hook

export {useSearch,SearchProvider}