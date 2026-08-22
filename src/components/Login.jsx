import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaUserPlus,
  FaArrowLeft
} from "react-icons/fa";

import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [forgotEmail, setForgotEmail] = useState("");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Remove accidental spaces
    const enteredEmail = email.trim().toLowerCase();
    const enteredPassword = password;

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!enteredEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!enteredPassword) {
      setError("Please enter your password.");
      return;
    }

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(enteredEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // ==========================================
    // GET REGISTERED USERS
    // ==========================================

    const registeredUsers =
      JSON.parse(
        localStorage.getItem("streamweaverUsers")
      ) || [];

    // ==========================================
    // CHECK USER
    // ==========================================

    const existingUser = registeredUsers.find(
      (user) =>
        user.email &&
        user.email.toLowerCase() === enteredEmail
    );

    // ==========================================
    // USER DOES NOT EXIST
    // ==========================================

    if (!existingUser) {
      setError(
        "No account found with this email. Please create an account first."
      );
      return;
    }

    // ==========================================
    // PASSWORD CHECK
    // ==========================================

    if (existingUser.password !== enteredPassword) {
      setError(
        "Incorrect password. Please try again."
      );
      return;
    }

    // ==========================================
    // LOGIN SUCCESS
    // ==========================================

    localStorage.setItem(
      "streamweaverLoggedIn",
      "true"
    );

    localStorage.setItem(
      "streamweaverUserEmail",
      existingUser.email
    );

    localStorage.setItem(
      "streamweaverUserName",
      existingUser.name || "User"
    );

    setSuccess("Login successful! Redirecting...");

    // ==========================================
    // GO TO DASHBOARD
    // ==========================================

    setTimeout(() => {
      navigate("/dashboard");
    }, 700);
  };

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================

  const handleForgotPassword = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const enteredEmail =
      forgotEmail.trim().toLowerCase();

    if (!enteredEmail) {
      setError("Please enter your registered email.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(enteredEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const registeredUsers =
      JSON.parse(
        localStorage.getItem("streamweaverUsers")
      ) || [];

    const existingUser = registeredUsers.find(
      (user) =>
        user.email &&
        user.email.toLowerCase() === enteredEmail
    );

    if (!existingUser) {
      setError(
        "No account found with this email address."
      );
      return;
    }

    /*
      For this frontend-only version, we cannot
      send a real reset email.

      We simply show a message.
    */

    setSuccess(
      "Your account was found. Password reset functionality will be connected to the backend."
    );
  };

  // ==========================================
  // CREATE ACCOUNT
  // ==========================================

  const handleCreateAccount = () => {
    navigate("/register");
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="login-page">

      {/* ======================================
          LEFT SIDE
      ====================================== */}

      <div className="login-left">

        <div className="login-left-content">

          <div className="login-brand">
            StreamWeaver
          </div>

          <h1>
            Stream your data.
            <br />
            Transform with ease.
          </h1>

          <p>
            A no-code ETL platform for processing
            large CSV and JSON datasets efficiently.
          </p>

          <div className="login-features">

            <div>
              <span>✓</span>
              Large Dataset Processing
            </div>

            <div>
              <span>✓</span>
              No-Code ETL Pipelines
            </div>

            <div>
              <span>✓</span>
              Real-Time Pipeline Monitoring
            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          RIGHT SIDE
      ====================================== */}

      <div className="login-right">

        <div className="login-card">

          {/* ==================================
              LOGIN ICON
          ================================== */}

          <div className="login-icon">
            <FaSignInAlt />
          </div>


          {/* ==================================
              TITLE
          ================================== */}

          <h2>
            Welcome Back
          </h2>

          <p className="login-subtitle">
            Login to your StreamWeaver account
          </p>


          {/* ==================================
              ERROR MESSAGE
          ================================== */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          {/* ==================================
              SUCCESS MESSAGE
          ================================== */}

          {success && (
            <div className="login-success">
              {success}
            </div>
          )}


          {/* ==================================
              LOGIN FORM
          ================================== */}

          {!showForgotPassword ? (

            <form onSubmit={handleLogin}>

              {/* ================================
                  EMAIL
              ================================= */}

              <div className="login-field">

                <label>
                  Email Address
                </label>

                <div className="login-input-wrapper">

                  <FaEnvelope className="login-input-icon" />

                  <input
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    autoComplete="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                      setSuccess("");
                    }}
                  />

                </div>

              </div>


              {/* ================================
                  PASSWORD
              ================================= */}

              <div className="login-field">

                <label>
                  Password
                </label>

                <div className="login-input-wrapper">

                  <FaLock className="login-input-icon" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                      setSuccess("");
                    }}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>


              {/* ================================
                  FORGOT PASSWORD
              ================================= */}

              <div className="forgot-password-container">

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setError("");
                    setSuccess("");
                  }}
                >
                  Forgot Password?
                </button>

              </div>


              {/* ================================
                  LOGIN BUTTON
              ================================= */}

              <button
                type="submit"
                className="login-button"
              >
                <FaSignInAlt />

                <span>
                  Login
                </span>
              </button>

            </form>

          ) : (

            /* ==================================
               FORGOT PASSWORD FORM
            ================================== */

            <form onSubmit={handleForgotPassword}>

              <div className="forgot-header">

                <button
                  type="button"
                  className="back-button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError("");
                    setSuccess("");
                  }}
                >
                  <FaArrowLeft />
                </button>

                <div>
                  <h3>
                    Forgot Password?
                  </h3>

                  <p>
                    Enter your registered email
                    address.
                  </p>
                </div>

              </div>


              <div className="login-field">

                <label>
                  Email Address
                </label>

                <div className="login-input-wrapper">

                  <FaEnvelope className="login-input-icon" />

                  <input
                    type="email"
                    value={forgotEmail}
                    placeholder="Enter your registered email"
                    autoComplete="email"
                    onChange={(event) => {
                      setForgotEmail(
                        event.target.value
                      );
                      setError("");
                      setSuccess("");
                    }}
                  />

                </div>

              </div>


              <button
                type="submit"
                className="login-button"
              >
                Continue
              </button>

            </form>

          )}


          {/* ==================================
              CREATE ACCOUNT
          ================================== */}

          {!showForgotPassword && (

            <div className="create-account-section">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                className="create-account-btn"
                onClick={handleCreateAccount}
              >
                <FaUserPlus />

                <span>
                  Create Account
                </span>
              </button>

            </div>

          )}


          {/* ==================================
              FOOTER
          ================================== */}

          <div className="login-footer">
            StreamWeaver • Secure Data Processing
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;