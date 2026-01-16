import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const base_URL = import.meta.env.VITE_BASE_URL;



function Auth() {

    const navigate = useNavigate();

    // Extract AuthToken from query string
    const queryString = window.location.search;
    //console.log(queryString);

    const urlParams = new URLSearchParams(queryString);
    //const urlParams = new URLSearchParams(location.search);
    //console.log(urlParams);

    const AuthToken = urlParams.get('Token');

    //const AuthToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InN1YmhlbmR1LmtheWFsQG1qdW5jdGlvbi5pbiIsInVuaXF1ZV9uYW1lIjoiU3ViaGVuZHUgS2F5YWwiLCJlY24iOiIxMjE2IiwibmJmIjoxNzM5ODc0Mjg3LCJleHAiOjE3NDAzMDYyODcsImlhdCI6MTczOTg3NDI4NywiaXNzIjoiSFJJUyIsImF1ZCI6InN1YmhlbmR1LmtheWFsQG1qdW5jdGlvbi5pbiJ9.3ssmGX8oGJSF3XX4Ka33gEVj64RE-8MH9wPypxs0E6A"
    //console.log(AuthToken);

    const authenticateToken = async () => {
        try {
            // Make the API call to the backend with the AuthToken
            const response = await axios.post(base_URL + "/api/auth", {
                token: AuthToken
            });

            const decryptedToken = response.data;

            console.log(decryptedToken);
            

            if (response.data.isSuccess) {
                localStorage.setItem('token', AuthToken);
                localStorage.setItem('username', decryptedToken.data.UniqueName);
                localStorage.setItem('email', decryptedToken.data.Email);
                localStorage.setItem('ECN', decryptedToken.data.Ecn);
                navigate("/allocation");
            }
            else {
                console.error("Authentication failed:", response.data.message);
                navigate('/');
            }
        }
        catch (error) {
            // Handle errors
            toast.error("Invalid token", "error")
            console.error('Error authenticating token:', error.response?.data || error.message);
            navigate('/');
        }
    };

    // Call the authenticateToken function when the component mounts
    useEffect(() => {
        if (AuthToken) {
            authenticateToken();
        } else {
            toast.error("AuthToken not found in query string")
            console.error('AuthToken not found in query string');
        }
    }, [AuthToken]);

    return (
        <div>Authenticating...</div>
    );
}

export default Auth;
