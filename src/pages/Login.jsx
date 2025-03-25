import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";
import "../../src/assets/css/login.css";

export default function Login() {
    const emailRef = useRef(null);
    const passRef = useRef(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setError(""); // Clear errors when user starts typing
    }, [emailRef.current?.value, passRef.current?.value]);

    const clearInputs = () => {
        if (emailRef?.current) emailRef.current.value = "";
        if (passRef?.current) passRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const email = emailRef.current.value;
        const password = passRef.current.value;

        try {
            const response = await fetch("http://localhost:3000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) throw new Error("Failed to login");

            const data = await response.json();
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("profilePicture", data.userProfile.profilePicture); // Assuming userProfile contains profilePicture URL
            localStorage.setItem("currentUser", JSON.stringify(data.userProfile)); // Save the entire user profile in localStorage
            localStorage.setItem("userId", data.userProfile._id); // Save the user ID in localStorage

            console.log("Login successful", data.userProfile);
            clearInputs();
            navigate("/");
        } catch (error) {
            setError(error.message || "Login failed");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const idToken = await user.getIdToken();

            const response = await fetch("http://localhost:3000/user/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken })
            });

            if (!response.ok) {
                throw new Error("Google login failed");
            }

            const data = await response.json();
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("profilePicture", user.photoURL);
            localStorage.setItem("currentUser", JSON.stringify(data.userProfile)); // Save the entire user profile in localStorage
            localStorage.setItem("userId", data.userProfile._id); // Save the user ID in localStorage

            console.log("Google login successful", data.userProfile);
            console.log("Profile Picture URL:", user.photoURL); // Add this line to verify the URL
            navigate("/");
        } catch (error) {
            console.error("Google login failed", error);
            setError("Google login failed");
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

                        <div className="divider">
                            <span>or sign in with email</span>
                        </div>

                        <button type="button" onClick={handleGoogleSignIn} className="google-sign-in-button">
                            <img
                                src="https://img.icons8.com/color/48/000000/google-logo.png"
                                className="google-logo"
                                alt="Google"
                            />
                            <span>Sign in with Google</span>
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
