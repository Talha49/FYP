import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-6">
      <div className="rounded-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Create Account
        </h2>
        <form className="space-y-6">
          <div className="flex gap-4">
            <div className="relative w-full">
              <input
                type="text"
                id="name"
                className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300"
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
              >
                Full Name
              </label>
            </div>

            <div className="relative w-full">
              <input
                type="email"
                id="email"
                className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-100 transition-all duration-300"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
              >
                Email Address
              </label>
            </div>
            <div className="relative w-full">
              <input
                type="number"
                id="contact"
                className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-100 transition-all duration-300"
                placeholder=" "
                required
              />
              <label
                htmlFor="contact"
                className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
              >
                Contact
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-6 w-full border-r border-gray-200 pr-4">
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-100 transition-all duration-300"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  id="confirm-password"
                  className="peer block w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="confirm-password"
                  className="absolute rounded-full left-4 -top-2.5 text-sm text-gray-600 px-1 transition-all bg-gray-100 peer-focus:bg-blue-500 peer-focus:text-white peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:px-1"
                >
                  Confirm Password
                </label>
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
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Register
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
