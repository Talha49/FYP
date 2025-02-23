"use client";
import { createInspection, fetchInspections } from "@/lib/Features/VtourSlice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CgSpinnerTwo } from "react-icons/cg";
import Dialog from "./_components/Dialog";
import { ArrowRight, Plus, Search } from "lucide-react";

const VirtualTour = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInspectionData, setNewInspectionData] = useState({
    title: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const { loading, error, inspections } = useSelector((state) => state.VTour);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchInspections());
  }, [dispatch]);

  // Handle Input Change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewInspectionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error when user types
  };

  // Filter tours based on search query and selected category
  let filteredInspections = inspections?.filter((tour) =>
    tour.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form Validation
  const validateForm = () => {
    let errors = {};
    if (!newInspectionData.title.trim()) errors.title = "Title is required.";
    if (!newInspectionData.description.trim())
      errors.description = "Description is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Function
  const createInspectionHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop submission if validation fails
    const res = await dispatch(createInspection(newInspectionData));
    if (res.payload._id) {
      alert("Inspection created successfully.");
      filteredInspections = filteredInspections.push(res.payload);
      setIsDialogOpen(false);
      setNewInspectionData({ title: "", description: "" });
    } else {
      alert("Failed to create inspection.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">
        Site Inspections
      </h1>

      {/* Add Inspection Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-full sm:max-w-sm p-3 border border-gray-300 rounded-lg shadow-sm bg-white transition focus-within:ring-2 focus-within:ring-blue-400">
          <Search className="text-blue-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search inspections..."
            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-all"
          disabled={loading}
        >
          <Plus /> Add Inspection
        </button>
      </div>

      {/* Inspections List */}
      {loading ? (
        <div className="text-lg w-full flex items-center justify-center h-32 gap-2">
          <CgSpinnerTwo className="text-xl animate-spin" />
          Fetching Inspections...
        </div>
      ) : error ? (
        <div className="text-red-500 text-lg">{error.message}</div>
      ) : null}
      {filteredInspections?.length === 0 && !loading && !error ? (
        <p className="text-center text-gray-500 text-lg">
          No inspections found.
        </p>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading &&
          filteredInspections?.map((inspection) => (
            <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative p-6 space-y-4">
                {/* Title with animated underline on hover */}
                <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  <span className="relative">
                    {inspection?.title}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                  </span>
                </h2>

                {/* Description with improved typography */}
                <p className="text-gray-600 leading-relaxed">
                  {inspection?.description}
                </p>

                {/* Enhanced call-to-action button */}
                <div className="pt-2">
                  <Link
                    href={`/VirtualTour/${inspection._id}`}
                    className="group/button inline-flex items-center justify-between w-full px-6 py-3 text-blue-600 font-semibold bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <span>Explore Inspection</span>
                    <ArrowRight className="w-5 h-5 transform group-hover/button:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add Inspection Dialog */}
      <Dialog
        title="Add Inspection"
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className={"max-w-xl"}
      >
        <form className="space-y-4" onSubmit={createInspectionHandler}>
          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-gray-700 font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Write title"
              value={newInspectionData.title}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                formErrors.title
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-400"
              }`}
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm">{formErrors.title}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-gray-700 font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Write description"
              value={newInspectionData.description}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg shadow-sm resize-none h-28 focus:outline-none focus:ring-2 ${
                formErrors.description
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-400"
              }`}
            ></textarea>
            {formErrors.description && (
              <p className="text-red-500 text-sm">{formErrors.description}</p>
            )}
          </div>

          {/* Error Message from Redux */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Inspection"}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default VirtualTour;
