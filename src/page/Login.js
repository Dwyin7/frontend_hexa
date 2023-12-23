import React, { useEffect } from "react";

function Login() {
    let url = "https://project-405004.ue.r.appspot.com/oauth2/authorization/google";
    // let url = "http://localhost:8080/oauth2/authorization/google"
    const handleLogin = () => {
        // Replace with your OAuth URL
        window.location.href = url;
    };

    return (
        <div>
            <h2>Login</h2>
            <button onClick={handleLogin}>Login with External Service</button>
        </div>
    );
}

export default Login;

