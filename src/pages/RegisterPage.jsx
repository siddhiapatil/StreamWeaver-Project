import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaCheckCircle
} from "react-icons/fa";

import "../styles/Register.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password requirements
  const hasEightCharacters = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const passwordValid =
    hasEightCharacters &&
    hasUppercase &&
    hasLowercase &&
    hasNumber;

  const handleRegister = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!passwordValid) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Get existing users
    const existingUsers =
      JSON.parse(localStorage.getItem("streamweaverUsers")) || [];

    // Check if email already exists
    const userExists = existingUsers.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      setError(
        "An account with this email already exists. Please login."
      );
      return;
    }

    // Create new user
    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password
    };

    existingUsers.push(newUser);

    localStorage.setItem(
      "streamweaverUsers",
      JSON.stringify(existingUsers)
    );

    setSuccess(
      "Account created successfully! Redirecting to login..."
    );

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="register-page">

      {/* LEFT SIDE */}
      <div className="register-left">

        <div className="register-brand">
          StreamWeaver
        </div>

        <h1>
          Build your data
          <br />
          pipeline with ease.
        </h1>

        <p>
          Create your StreamWeaver account and start
          processing large datasets efficiently.
        </p>

        <div className="register-features">

          <div>
            <FaCheckCircle />
            Large Dataset Processing
          </div>

          <div>
            <FaCheckCircle />
            No-Code ETL Pipelines
          </div>

          <div>
            <FaCheckCircle />
            Real-Time Pipeline Monitoring
          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="register-right">

        <div className="register-card">

          <div className="register-icon">
            <FaUserPlus />
          </div>

          <h2>
            Create Account
          </h2>

          <p className="register-subtitle">
            Join StreamWeaver today
          </p>


          {/* ERROR */}
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}


          {/* SUCCESS */}
          {success && (
            <div className="register-success">
              {success}
            </div>
          )}


          <form onSubmit={handleRegister}>

            {/* NAME */}
            <div className="register-field">

              <label>
                Full Name
              </label>

              <div className="register-input-wrapper">

                <FaUser className="register-input-icon" />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

              </div>

            </div>


            {/* EMAIL */}
            <div className="register-field">

              <label>
                Email Address
              </label>

              <div className="register-input-wrapper">

                <FaEnvelope className="register-input-icon" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="register-field">

              <label>
                Password
              </label>

              <div className="register-input-wrapper">

                <FaLock className="register-input-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
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


            {/* CONFIRM PASSWORD */}
            <div className="register-field">

              <label>
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <FaLock className="register-input-icon" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-eye"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>


            {/* PASSWORD RULES */}
            <div className="password-rules">

              <div
                className={
                  hasEightCharacters ? "valid" : ""
                }
              >
                <FaCheckCircle />
                8 or more characters
              </div>

              <div
                className={
                  hasUppercase ? "valid" : ""
                }
              >
                <FaCheckCircle />
                One uppercase letter
              </div>

              <div
                className={
                  hasLowercase ? "valid" : ""
                }
              >
                <FaCheckCircle />
                One lowercase letter
              </div>

              <div
                className={
                  hasNumber ? "valid" : ""
                }
              >
                <FaCheckCircle />
                One number
              </div>

            </div>


            <button
              type="submit"
              className="register-button"
            >
              <FaUserPlus />
              Create Account
            </button>

          </form>


          {/* LOGIN LINK */}
          <div className="login-link">

            Already have an account?

            <button
              type="button"
              onClick={() => navigate("/")}
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;