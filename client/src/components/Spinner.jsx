import React, { useState, useEffect } from 'react';
import { useNavigate , useLocation } from 'react-router-dom';

const Spinner = ({path="login"}) => {
    const [count, setCount] = useState(3);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevX) => prevX - 1);
        }, 1000);

        if (count === 0) {
            navigate(`/${path}`,{state:location.pathname});
        }

        return () => clearInterval(interval);
    }, [count, navigate,location,path]);

    

    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                <h2 className="text-center">Redirecting you in {count} seconds</h2>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    );
}

export default Spinner;
