import React from 'react'
import { Link } from 'react-router-dom'

const footer = () => {
  return (
    <>    
      <div className='footer' >
       <h6 className='text-center'>All Right Reserved &copy; Sumit Verma</h6>
       <div className="text-center mt-3">
        <Link className='footerLink' to='/about'>About</Link> | 
        <Link className='footerLink' to='/contact'>Contact</Link> | 
        <Link className='footerLink' to='/policy'>Policy</Link>
       </div>
      </div> 
    </>
  )
}

export default footer