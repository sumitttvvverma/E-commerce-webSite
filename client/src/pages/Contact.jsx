import React from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import imgC from '../images/contactus.jpeg'

const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="row contactus mt-3">
        <div className="col-md-6 ">
          <img
            src={imgC}
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            any query and info about prodduct feel free to call anytime we 24X7
            vaialible
          </p>
          <p className="mt-3">
            <BiMailSend /> : www.jrsumitverma@gmail.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 76658-89749
          </p>
          <p className="mt-3">
            <BiSupport /> : 1800-0000-0000 (toll free)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;