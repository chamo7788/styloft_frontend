import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/register.css";

export default function Register() {
    const firstName = useRef(null);
    const lastName = useRef(null);
    const emailRef = useRef(null);
    const passRef = useRef(null);
    const confirmPassRef = useRef(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const clearInputs = () => {
        if (firstName?.current) firstName.current.value = "";
        if (lastName?.current) lastName.current.value = "";
        if (emailRef?.current) emailRef.current.value = "";
        if (passRef?.current) passRef.current.value = "";
        if (confirmPassRef?.current) confirmPassRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const creds = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            email: emailRef.current.value,
            password: passRef.current.value,
            confirmPassword: confirmPassRef.current.value,
        };

        if (creds.password !== creds.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(creds),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Registration successful", data);
                clearInputs();
                navigate("/login"); // Redirect to login page
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            setError("Failed to register. Please try again.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        window.location.href = "http://localhost:5000/auth/google";
    };

    return (
        <>
            <div className="image-box"></div>
            <div className="register">
                <div className="logincover">
                    <h2 className="heading">Create a Styloft Account</h2>
                    <form onSubmit={handleSubmit} className="form">
                        {error && <span className="error-msg">{error}</span>}

                        <button type="button" className="social-btn google" onClick={handleGoogleSignIn}>
                            <img src="https://img.icons8.com/color/48/000000/google-logo.png" className="google-logo" alt="Google" />
                            <span>Sign in with Google</span>
                        </button>

                        <div className="role-selection"></div>

                        <p>First Name</p>
                        <input required ref={firstName} type="text" placeholder="First Name" />

                        <p>Last Name</p>
                        <input required ref={lastName} type="text" placeholder="Last Name" />

                        <p>Email</p>
                        <input required ref={emailRef} type="email" placeholder="Email" />

                        <p>Password</p>
                        <input required ref={passRef} type="password" placeholder="Password" />

                        <p>Confirm Password</p>
                        <input required ref={confirmPassRef} type="password" placeholder="Confirm Password" />

                        <button disabled={loading} type="submit" className="register-button">
                            {loading ? "Loading..." : "Register"}
                        </button>

                        <span className="link">
                            <a href="/login">Already have an account? Sign in here.</a>
                        </span>
                    </form>
                </div>
            </div>
        </>
    );
}