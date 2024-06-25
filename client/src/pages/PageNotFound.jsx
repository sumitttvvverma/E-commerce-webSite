import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const Pagenotfound = () => {
  return (
    <Layout title={"go back- page not found"}>
      <div className="pnf">
        <h1 className="pnf-title">404</h1>
        <h2 className="pnf-heading">Oops ! Page Not Found</h2>
       <div className="mt-3" style={{border: '2px solid red', display: "inline-flex",  borderRadius: "7px"}}>
        <Link to="/" className="pnf-btn p-2  text-center" style={{textDecoration:'none',borderRadius:'5px' }}>
          Go Back
        </Link>
        </div>  
      </div>
    </Layout>
  );
};

export default Pagenotfound;
    