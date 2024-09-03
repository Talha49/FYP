import React, { useState, useEffect } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";

const ForgotPasswordDialog = ({ children, isOpen, onClose }) => {
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

const Login = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otp, setOtp] = useState(null);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [varified, setVarified] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({
    newPass: "",
    confirm: "",
  });
  const router = useRouter();

  // console.log("Entered OTP =>", enteredOTP);
  // console.log("OTP =>", otp);

  useEffect(() => {
    if (enteredOTP === otp) {
      setVarified(true);
      setForgotSuccess("");
    } else {
      setVarified(false);
    }
  }, [enteredOTP, otp]);

  // console.log(varified);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleNewPasswordChange = (e) => {
    setNewPasswordData({
      ...newPasswordData,
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

      const cookieData = {
        id: response?.data?.user?.id,
        fullName: response?.data?.user?.fullName,
        email: response?.data?.user?.email,
        image: response?.data?.user?.image,
        isSocialLogin: response?.data?.user?.isSocialLogin,
        token: response?.data?.token,
      };
      Cookies.set("user", JSON.stringify(cookieData), {
        expires: 1, // 1 day
        secure: false, // true in production with HTTPS
        path: "/",
      });

      setSuccess("Login successful!");
      setFormData({
        email: "",
        password: "",
      });
      router.push("/");
      // console.log(response.data);
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

  const handleUpdatePassword = async () => {
    setForgotError(""); // Reset any existing errors

    if (!newPasswordData.newPass || !newPasswordData.confirm) {
      setForgotError("Both fields are required.");
      return;
    } else if (newPasswordData.newPass !== newPasswordData.confirm) {
      setForgotError("Passwords do not match.");
      return;
    } else {
      setIsSendingOTP(true);
      try {
        const res = await axios.put(
          "/api/auth/reset-password",
          {
            email: forgotEmail,
            newPassword: newPasswordData.newPass,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setForgotSuccess(res?.data?.message);
        setIsSendingOTP(false);
        setNewPasswordData({
          newPass: "",
          confirm: "",
        });
      } catch (error) {
        setForgotError("Failed to update password. Please try again later.");
        setIsSendingOTP(false);
      }
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
              <p className=" text-right my-1 text-sm">
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  Forgot Password
                </span>
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
                await signIn("facebook", { callbackUrl: "/" });
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
          setForgotEmail("");
          setForgotError("");
          setForgotSuccess("");
          setEnteredOTP("");
          setVarified(false);
        }}
      >
        <div className="flex items-center gap-4">
          {varified && (
            <span
              className="text-xl bg-gray-200 cursor-pointer hover:bg-blue-200 p-1 rounded-full transition-all"
              onClick={() => {
                setVarified(false);
                setIsSendingOTP(false);
                // setEnteredOTP("");
                // setForgotSuccess("");
                // setForgotEmail("")
              }}
            >
              <IoMdArrowRoundBack />
            </span>
          )}
          <h1 className="flex items-center">
            Forgot Password <MdOutlineNavigateNext className="text-xl" />
            {!varified ? (
              <span className="text-blue-500">Varification</span>
            ) : (
              <span className="text-blue-500">Reset Password</span>
            )}
          </h1>
        </div>
        {!varified ? (
          <>
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
          </>
        ) : (
          <>
            {forgotError && (
              <p className="text-red-500 bg-red-50 border border-red-100 rounded flex items-center justify-between gap-4 py-1 px-2">
                <span>{forgotError}</span>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setForgotError("");
                  }}
                >
                  <IoClose />
                </span>
              </p>
            )}
            {forgotSuccess && (
              <p className="text-green-500 bg-green-50 border border-green-100 rounded flex items-center justify-between gap-4 py-1 px-2">
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
            <div className="my-4 flex flex-col justify-center items-center gap-6">
              <div className="relative w-full">
                <input
                  id="newPass"
                  type="password"
                  className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-100 transition-all duration-300"
                  placeholder=" "
                  value={newPasswordData.newPass}
                  onChange={handleNewPasswordChange}
                />
                <label
                  htmlFor="newPass"
                  className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
                >
                  New Password
                </label>
              </div>
              <div className="relative w-full ">
                <input
                  id="confirm"
                  type="password"
                  className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-100 transition-all duration-300"
                  placeholder=" "
                  value={newPasswordData.confirm}
                  onChange={handleNewPasswordChange}
                />
                <label
                  htmlFor="confirm"
                  className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
                >
                  Confirm New Password
                </label>
              </div>
              <button
                className="button w-fit text-white p-2 rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-500 disabled:text-black"
                disabled={isSendingOTP}
                onClick={handleUpdatePassword}
              >
                {isSendingOTP ? "Please wait..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </ForgotPasswordDialog>
    </div>
  );
};

export default Login;
