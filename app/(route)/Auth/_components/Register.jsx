"use client";
import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    password: "",
    isSocialLogin: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors
    setIsSubmitting(true); // Start form submission

    // Basic form validation
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address.";

    if (!formData.contact) newErrors.contact = "Contact number is required.";
    else if (formData.contact.length < 11)
      newErrors.contact = "Contact number must be at least 11 digits.";

    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false); // End form submission
      return;
    }

    // Proceed with API request if no errors
    try {
      const response = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess("Registration successful!");
      setFormData({
        fullName: "",
        email: "",
        contact: "",
        password: "",
      });
      setConfirmPassword("");
      console.log(response.data);
    } catch (err) {
      if (err.response) {
        // Server responded with a status other than 2xx
        setErrors({ form: err.response.data.error || "Something went wrong." });
      } else {
        // No response from server or other errors
        setErrors({ form: "Failed to register. Please try again later." });
      }
    } finally {
      setIsSubmitting(false); // End form submission
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-2">
      <div className="rounded-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Create Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {errors.form && (
            <p className="text-red-500 bg-red-50 border border-red-100 rounded flex items-center justify-between gap-4 py-1 px-2">
              <span>{errors.form}</span>{" "}
              <span
                className="cursor-pointer"
                onClick={() => {
                  setErrors({});
                }}
              >
                <IoClose />
              </span>
            </p>
          )}
          {success && (
            <p className="text-green-500 bg-green-50 border border-green-100 flex items-center justify-between gap-4 py-1 px-2">
              <span>{success}</span>{" "}
              <span
                className="cursor-pointer"
                onClick={() => {
                  setSuccess("");
                }}
              >
                <IoClose />
              </span>
            </p>
          )}
          <div className="flex gap-4">
            <div className="relative w-full">
              <input
                type="text"
                id="fullName"
                className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300"
                placeholder=" "
                value={formData.fullName}
                onChange={handleChange}
              />
              <label
                htmlFor="fullName"
                className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
              >
                Full Name
              </label>
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="relative w-full">
              <input
                type="text"
                id="email"
                className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
              />
              <label
                htmlFor="email"
                className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
              >
                Email Address
              </label>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div className="relative w-full">
              <input
                type="number"
                id="contact"
                className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300"
                placeholder=" "
                value={formData.contact}
                onChange={handleChange}
              />
              <label
                htmlFor="contact"
                className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
              >
                Contact
              </label>
              {errors.contact && (
                <p className="text-xs text-red-500 mt-1">{errors.contact}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-6 w-full border-r border-gray-200 pr-4">
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300"
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
                />
                <label
                  htmlFor="password"
                  className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
                >
                  Password
                </label>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type="password"
                  id="confirm-password"
                  className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300"
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label
                  htmlFor="confirm-password"
                  className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
                >
                  Confirm Password
                </label>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <div className="w-[70%] py-4 flex flex-col gap-2">
              <button className="bg-white p-2 rounded-full border shadow-md flex items-center justify-center gap-2">
                <FcGoogle className="text-xl" />
                Continue With Google
              </button>
              <button className="bg-white p-2 rounded-full border shadow-md flex items-center justify-center gap-2">
                <FaFacebook className="text-xl text-blue-500" />
                Continue With Facebook
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full font-semibold py-2 rounded-lg transition-colors duration-300 ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
