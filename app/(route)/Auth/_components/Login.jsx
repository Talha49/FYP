import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { signIn } from "next-auth/react";
import Dialog from "@/app/_components/Dialog/Dialog";

const ForgotPasswordDialog = ({ children, isOpen, onClose }) => {
  return (
    <div
      className={`${
        isOpen ? "fixed" : "hidden"
      } inset-0 overflow-auto bg-black bg-opacity-30 flex  items-center justify-center top-0 ml-8`}
    >
      <div
        className="absolute top-20 right-5 text-3xl cursor-pointer z-10 hover:bg-gray-300 rounded-lg transition-all"
        onClick={onClose}
      >
        <IoClose />
      </div>
      <div className="bg-white shadow-lg rounded-lg border w-[500px] min-h-[300px] m-4 p-4">
        {children}
      </div>
    </div>
  );
};

const Login = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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

    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address.";

    if (!formData.password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false); // End form submission
      return;
    }

    // Proceed with API request if no errors
    try {
      const response = await axios.post("/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess("Login successful!");
      setFormData({
        email: "",
        password: "",
      });
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        setErrors({
          form: error.response.data.error || "Invalid credentials.",
        });
      } else if (error.request) {
        setErrors({
          form: "No response from the server. Please try again later.",
        });
      } else {
        setErrors({ form: "Failed to log in. Please try again later." });
      }
    } finally {
      setIsSubmitting(false); // End form submission
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-2">
      <div className="rounded-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Login to your Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {errors.form && (
            <p className="text-red-500 bg-red-50 border border-red-100 rounded flex items-center justify-between gap-4 py-1 px-2">
              <span>{errors.form}</span>
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
              <span>{success}</span>
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

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div className="relative w-full">
              <input
                // type="email"
                id="email"
                className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-100 transition-all duration-300"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                // required
              />
              <label
                htmlFor="email"
                className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
              >
                Email Address
              </label>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div className="relative w-full">
              <input
                type="password"
                id="password"
                className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-100 transition-all duration-300"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                // required
              />
              <label
                htmlFor="password"
                className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
              >
                Password
              </label>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
              <p
                className="text-blue-500 hover:underline cursor-pointer text-right my-1 text-sm"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Forgot Password
              </p>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full text-white font-semibold py-2 rounded-lg transition-colors duration-300 ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          <div className="w-full flex items-center gap-1">
            <div className="h-[1px] w-full bg-gray-300"></div>
            <span>or</span>
            <div className="h-[1px] w-full bg-gray-300"></div>
          </div>
          <div className="flex items-center justify-center md:gap-2 gap-4">
            <button
              type="button"
              className={`flex items-center justify-center gap-2 border border-gray-200 md:py-2 md:px-4 p-4 md:rounded rounded-full shadow-md hover:shadow-none transition-shadow focus:outline-none text-sm md:w-full w-fit`}
              onClick={async () => {
                await signIn("google", { callbackUrl: "/" });
              }}
            >
              <FcGoogle size={20} />{" "}
              <span className="hidden md:flex">Continue with Google</span>
            </button>
            <button
              type="button"
              className={`flex items-center justify-center gap-2 border border-gray-200 md:py-2 md:px-4 p-4 md:rounded rounded-full shadow-md hover:shadow-none transition-shadow focus:outline-none text-sm md:w-full w-fit`}
              onClick={async () => {
                await signIn("facebook", { callbackUrl: "/", });
              }}
            >
              <FaFacebook className="text-blue-600" size={20} />{" "}
              <span className="hidden md:flex">Continue with Facebook</span>
            </button>
          </div>
        </form>
      </div>
      <ForgotPasswordDialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <h1>Forgot Password</h1>
      </ForgotPasswordDialog>
    </div>
  );
};

export default Login;
