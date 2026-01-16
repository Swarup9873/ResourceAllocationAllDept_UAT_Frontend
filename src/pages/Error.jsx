import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function ErrorPage() {
    useEffect(() => {
        localStorage.setItem("authToken", "");
        localStorage.setItem('username', '');
        localStorage.setItem('email', '');
        localStorage.setItem('ECN', '');
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100 p-6 animate-fadeIn">
            <h1 className="text-7xl font-extrabold text-red-600">404</h1>
            <h2 className="text-2xl font-semibold mt-4 text-gray-800">Page Not Found</h2>
            <p className="mt-2 text-gray-600 max-w-md">
                Oops! The page you're looking for doesn't exist. <br />
                You may have mistyped the address or the page may have moved.
            </p>
            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
                Go to Home
            </Link>
        </div>
    );
}

export default ErrorPage;
