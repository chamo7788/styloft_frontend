import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import "../assets/css/register.css";

export default function Register() {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const confirmPassRef = useRef(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearInputs = () => {
    [firstNameRef, lastNameRef, emailRef, passRef, confirmPassRef].forEach(
      (ref) => ref?.current && (ref.current.value = "")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passRef.current.value;
    const confirmPassword = confirmPassRef.current.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      const response = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }

      console.log("Registration successful");
      clearInputs();
      navigate("/login");
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      const response = await fetch("http://localhost:3000/user/google-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register with Google");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("profilePicture", user.photoURL);
      localStorage.setItem("currentUser", JSON.stringify(data.userProfile)); // Save the entire user profile in localStorage
      localStorage.setItem("userId", data.userProfile._id); // Save the user ID in localStorage

      console.log("Google Sign-In successful");
      navigate("/");
    } catch (error) {
      setError(error.message || "Google Sign-In failed");
    }
  };

  return (
    <>
      <div className="image-box"></div>
      <div className="register">
        <div className="logincover">
          <h2 className="heading">Create a Styloft Account</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="position-radio-group">
              <label>
                <input type="radio" name="position" value="Designer" required />
                Designer
              </label>
              <label>
                <input type="radio" name="position" value="Student" required />
                Student
              </label>
              <label>
                <input type="radio" name="position" value="Enthusiast" required />
                Enthusiast
              </label>
            </div>
            {error && <span className="error-msg">{error}</span>}
            <div className="name-title">
              <p>First Name</p>
              <p>Last Name</p>
            </div>
            <div className="name-inputs">
              <input
                ref={firstNameRef}
                type="text"
                placeholder="First Name"
                aria-label="First Name"
                required
              />
              
              <input
                ref={lastNameRef}
                type="text"
                placeholder="Last Name"
                aria-label="Last Name"
                required
              />

            </div>

            <p>Email</p>
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              aria-label="Email"
              required
            />

            <p>Password</p>
            <input
              ref={passRef}
              type="password"
              placeholder="Password"
              aria-label="Password"
              required
            />

            <p>Confirm Password</p>
            <input
              ref={confirmPassRef}
              type="password"
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              required
            />

            <button disabled={loading} type="submit" className="register-button">
              {loading ? "Loading..." : "Register"}
            </button>

            <div className="divider">
              <span>or register with email</span>
            </div>

            <button type="button" className="social-btn google" onClick={handleGoogleSignIn}>
              <img
                src="https://img.icons8.com/color/48/000000/google-logo.png"
                className="google-logo"
                alt="Google"
              />
              <span>Sign in with Google</span>
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