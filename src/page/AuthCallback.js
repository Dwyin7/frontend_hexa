import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        console.log(token)
        if (token) {
            localStorage.setItem('token', token);
            console.log("redirect to contents")
            window.location.href = '/contents';

        } else {
            navigate('/login');
        }
    }, []);

    return <div>Loading...</div>;
};

export default AuthCallback;
