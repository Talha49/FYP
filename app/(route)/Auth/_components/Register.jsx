"use client";
import React, { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const TwoFactorAuthDialog = ({ children, isOpen, onClose }) => {
  return (
    <div
      className={`${
        isOpen ? "fixed animate-fade-in" : "hidden animate-fade-out"
      } inset-0 overflow-auto bg-black bg-opacity-20 flex  items-center justify-center top-0 ml-8`}
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
  const [isOpenTwoFactorDialog, setIsOpenTwoFactorDialog] = useState(false);
  const [otp, setOtp] = useState(null);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [varified, setVarified] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (enteredOTP === otp) {
      setVarified(true);
      setForgotSuccess("");
    } else {
      setVarified(false);
    }
  }, [enteredOTP, otp]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSendOtp = async () => {
    setForgotError("");
    setForgotSuccess("");
    setIsSendingOTP(true);
    try {
      if (!forgotEmail) {
        setForgotError("Email is required.");
        setIsSendingOTP(false);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
        setForgotError("Invalid email address.");
        setIsSendingOTP(false);
      } else {
        const res = await axios.post(
          "/api/auth/forgot-password",
          {
            email: forgotEmail,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.data.message) {
          // console.log(res.data);
          setForgotSuccess(res.data.message);
          setIsSendingOTP(false);
          setOtp(res?.data?.otp);
        } else {
          console.log(res.data);
          setForgotError(res.data.error);
          setIsSendingOTP(false);
        }
      }
    } catch (error) {
      console.log(error);
      setIsSendingOTP(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors
    setIsSubmitting(true); // Start form submission

    // Basic form validation
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    } else {
      // Advanced email validation logic
      const atSymbolCount = (formData.email.match(/@/g) || []).length;
      const dotComCount = (formData.email.match(/\.com/g) || []).length;
    
      if (atSymbolCount > 1) {
        newErrors.email = "Email cannot contain multiple '@' symbols.";
      } else if (dotComCount > 1) {
        newErrors.email = "Email cannot contain multiple '.com'.";
      } else {
        const emailDomain = formData.email.split('@')[1]; // Get the domain part (after @)
        const domainKeywordMatches = emailDomain.match(/(gmail|yahoo|outlook)/gi) || [];
        const uniqueDomainKeywords = new Set(domainKeywordMatches);
    
        if (uniqueDomainKeywords.size < domainKeywordMatches.length) {
          newErrors.email = "Email domain contains repeated keywords.";
        }
      }
    }
    

    if (!formData.contact) newErrors.contact = "Contact number is required.";
    else if (formData.contact.length < 11)
      newErrors.contact = "Contact number must be at least 11 digits.";

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*_#?&])[A-Za-z\d@$!%*#_?&]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*_#?&).";
    }

    if (formData.password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false); // End form submission
      return;
    }

    if (!Object.keys(newErrors).length > 0) {
      setIsOpenTwoFactorDialog(true);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const registerUser = async () => {
      setIsOpenTwoFactorDialog(false);
      setForgotEmail("");
      setForgotError("");
      setForgotSuccess("");
      setEnteredOTP("");
      setVarified(false);
      if (varified) {
        setIsSubmitting(true); // Start form submission
        // Proceed with API request if no errors
        try {
          const result = await signIn("register", {
            callbackUrl: "/",
            redirect: false, // Ensure no redirect, handle in your app
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            contact: formData.contact,
          });

          if (result.error) {
            setErrors({ form: result.error }); // Display the specific error message
            setIsSubmitting(false);
          } else {
            router.push(result.url); // Redirect to the callback URL if successful
            setIsSubmitting(false);
          }
        } catch (error) {
          console.log(error);
          console.error("Error in registration:", error.message);
          setErrors({ form: "Registration failed. Please try again later." });
        } finally {
          setIsSubmitting(false); // End form submission
        }
      }
    };
    registerUser();
  }, [varified]);

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
          <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 grid-cols-1">
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
                type="tel"
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

          <div className="flex items-center md:flex-row flex-col gap-4">
            <div className="flex flex-col gap-6 w-full md:border-r border-gray-200 md:pr-4">
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
                  id="confirmPassword"
                  className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300"
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label
                  htmlFor="confirmPassword"
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

            <div className="flex flex-col w-full">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
              <div className="flex items-center gap-1 md:my-2 my-5">
                <span className="h-[1px] bg-gray-300 w-full"></span>
                <p className="w-fit">or</p>
                <span className="h-[1px] bg-gray-300 w-full"></span>
              </div>
              <div className="flex justify-center md:gap-2 gap-4">
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 border border-gray-200 md:py-2 md:px-4 p-4 md:rounded rounded-full shadow-md hover:shadow-none transition-shadow focus:outline-none text-sm md:w-full w-fit`}
                  onClick={async () =>
                    await signIn("google", { callbackUrl: "/" })
                  }
                >
                  <FcGoogle size={20} />{" "}
                  <span className="hidden md:flex">Continue with Google</span>
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 border border-gray-200 md:py-2 md:px-4 p-4 md:rounded rounded-full shadow-md hover:shadow-none transition-shadow focus:outline-none text-sm md:w-full w-fit`}
                  onClick={async () =>
                    await signIn("facebook", { callbackUrl: "/" })
                  }
                >
                  <FaFacebook className="text-blue-600" size={20} />{" "}
                  <span className="hidden md:flex">Continue with Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {isOpenTwoFactorDialog && (
        <TwoFactorAuthDialog
          isOpen={isOpenTwoFactorDialog}
          onClose={() => {
            setIsOpenTwoFactorDialog(false);
            setForgotEmail("");
            setForgotError("");
            setForgotSuccess("");
            setEnteredOTP("");
            setVarified(false);
          }}
        >
          <h1 className="text-center text-xl font-semibold">
            Verify your account with a 5-digit code.
          </h1>
          {forgotSuccess && (
            <p className="text-green-500 bg-green-50 border border-green-100 flex items-center justify-between gap-4 py-1 px-2">
              <span>{forgotSuccess}</span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  setForgotSuccess("");
                }}
              >
                <IoClose />
              </span>
            </p>
          )}
          <div className="relative w-full my-4">
            <input
              id="forgot"
              className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-100 transition-all duration-300"
              placeholder=" "
              value={forgotEmail}
              onChange={(e) => {
                setForgotEmail(e.target.value);
              }}
            />
            <label
              htmlFor="forgot"
              className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
            >
              Email Address
            </label>
            {forgotError && (
              <p className="text-sm text-red-500 mt-1">{forgotError}</p>
            )}
          </div>
          <div className="w-full flex justify-center">
            <button
              className="button w-32 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:text-black transition-all px-2 py-1 rounded-lg"
              disabled={isSendingOTP}
              onClick={handleSendOtp}
            >
              {isSendingOTP ? "Sending..." : <span>Send Code</span>}
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 my-5">
            {[...Array(5)].map((_, index) => (
              <input
                key={index}
                type="text"
                className="w-16 h-16 text-center text-2xl border bg-gray-50 focus:outline-blue-500 shadow-md rounded-lg"
                maxLength="1"
                disabled={!otp}
                value={enteredOTP[index] || ""}
                onChange={(e) => {
                  const input = e.target;
                  const value = input.value;
                  const updatedOTP = enteredOTP.split("");

                  if (value.length === 1) {
                    updatedOTP[index] = value;
                    if (input.nextElementSibling) {
                      input.nextElementSibling.focus();
                    }
                  } else if (value.length === 0) {
                    updatedOTP[index] = "";
                    if (input.previousElementSibling) {
                      input.previousElementSibling.focus();
                    }
                  }

                  setEnteredOTP(updatedOTP.join(""));

                  if (updatedOTP.join("").length === 5) {
                    // console.log("OTP:", updatedOTP.join(""));
                  }
                }}
              />
            ))}
          </div>
        </TwoFactorAuthDialog>
      )}
    </div>
  );
};

export default Register;
