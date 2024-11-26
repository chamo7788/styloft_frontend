import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";

export default function Login() {
    const emailRef = useRef();
    const passRef = useRef();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const clearInputs = () => {
        if (emailRef?.current) emailRef.current.value = "";
        if (passRef?.current) passRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const creds = {
            email: emailRef.current.value,
            password: passRef.current.value,
        };

        try {
            const response = await fetch("http://localhost:3000/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(creds),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Login successful", data);
                // Store token or session (if needed)
                clearInputs();
                navigate("/home");  // Redirect to Home page
            } else {
                setError(data.message || "Login failed");
            }
        } catch (error) {
            setError("Failed to login. Please try again.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="image-section"></div>
            <div className="login">
                <div className="wrapper">
                    <h2 className="heading">Sign in to Styloft</h2>
                    <form onSubmit={handleSubmit} className="form">
                        {error && <span className="error-msg">{error}</span>}

                        <button className="social-btn google">
                            <img src="https://img.icons8.com/color/48/000000/google-logo.png" className="google-logo" alt="Google" />
                            <span>Sign in with Google</span>
                        </button>

                        <div className="divider">
                            <span>or sign in with email</span>
                        </div>

                        <p>Username or Email</p>
                        <input required ref={emailRef} type="email" placeholder="Email" />
                        <p>Password</p>
                        <input required ref={passRef} type="password" placeholder="Password" />
                        <span className="forgot-link">
                            <a href="/forgot-password">Forgot password?</a>
                        </span>

                        <button disabled={loading} type="submit" className="sign-in-button">
                            {loading ? "Loading..." : "Sign in"}
                        </button>

                        <span className="link">
                            <a href="/register">No account? Register here.</a>
                        </span>
                    </form>
                </div>
            </div>
        </>
    );
}
