import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSortAmountDown, FaGlobe, FaExpand } from "react-icons/fa";
import { CiExport } from "react-icons/ci";
import { VscClose } from "react-icons/vsc";
import Image from "next/image";
import Dialog from "../Dialog/Dialog";
import FieldNoteModalCardsModal from "../FieldNoteModalCardsModal/FieldNoteModalCardsModal";
import { fetchFieldNotes } from "@/lib/Features/FieldNoteSlice";

const FieldNotesModal = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const notes = useSelector((state) => state.FieldNotesSlice.FieldNotes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFieldNotes());
  }, [dispatch]);

  const filterButtons = [
    "For me",
    "Tags",
    "Status",
    "Due date",
    "Assignee",
    "Date created",
    "Priority",
    "Creator"
  ];

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    setSearchParam(""); // Clear search when toggling filters
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchParam("");
  };

  const filterNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = searchParam === "" || 
        (activeFilters.includes("Assignee") ? 
          note.assignee.toLowerCase().includes(searchParam.toLowerCase()) :
          note.name.toLowerCase().includes(searchParam.toLowerCase()) || 
          note.description.toLowerCase().includes(searchParam.toLowerCase()) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchParam.toLowerCase())) ||
          note.status.toLowerCase().includes(searchParam.toLowerCase()) ||
          note.priority.toLowerCase().includes(searchParam.toLowerCase()) ||
          note.room.toLowerCase().includes(searchParam.toLowerCase()) ||
          note.floor.toLowerCase().includes(searchParam.toLowerCase())
        );

      const matchesFilters = activeFilters.every((filter) => {
        switch (filter) {
          case "Tags":
            return note.tags.length > 0;
          case "Status":
            return note.status !== "";
          case "Due date":
            return note.dueDate !== null;
          case "Assignee":
            return note.assignee !== "";
          case "Date created":
            return note.createdAt !== null;
          case "Priority":
            return note.priority !== "";
          default:
            return true;
        }
      });

      return matchesSearch && matchesFilters;
    });
  }, [notes, searchParam, activeFilters]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  const handleCardClick = (note) => {
    setSelectedNote(note);
    setIsOpen(true);
  };

  const getSearchPlaceholder = () => {
    if (activeFilters.length === 0) return "Search Field Notes";
    if (activeFilters.length > 1) return "Search in selected filters";
    
    const activeFilter = activeFilters[0];
    switch (activeFilter) {
      case "Tags":
        return "Search tags";
      case "Status":
        return "Search by status";
      case "Due date":
        return "Search by due date";
      case "Assignee":
        return "Search by assignee";
      case "Date created":
        return "Search by creation date";
      case "Sheets":
        return "Search sheets";
      case "Creator":
        return "Search by creator";
      default:
        return `Search ${activeFilter}`;
    }
  };

  return (
    <>
      <div className="bg-white h-full overflow-auto">
        <div className="border-b-2 bg-white sticky top-0 p-4 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">FieldNotes</h1>
            <button className="hover:bg-gray-200 p-2 rounded-md" onClick={onClose}>
              <VscClose size={20} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              type="text"
              placeholder={getSearchPlaceholder()}              className="border border-gray-300 rounded-md p-2 w-full outline-none md:max-w-[70%]"
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
            />
            <button className="bg-transparent border p-2 rounded-md">
              <FaSortAmountDown />
            </button>
            <button className="bg-transparent text-blue-700 border flex items-center gap-2 p-2 rounded-md">
              <CiExport />
              Export
            </button>
          </div>
          <div className="flex flex-wrap items-center">
            <div className="flex flex-wrap gap-1 text-xs">
              {filterButtons.map((filter) => (
                <button
                  key={filter}
                  className={`border ${
                    activeFilters.includes(filter)
                      ? "bg-blue-500 text-white"
                      : "border-black/15 hover:bg-slate-200"
                  } p-2 rounded-full`}
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex justify-end ml-auto mt-1">
              <button
                className="text-black p-2 text-xs bg-slate-200 rounded-md"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          </div>
          <div className="text-gray-600 mt-2">{filterNotes.length} results</div>
        </div>

        <div className="p-4">
          {filterNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterNotes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white shadow-md rounded-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCardClick(note)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{note.name}</h3>
                      <p className="text-sm text-gray-600">
                        {note.room} &nbsp;&nbsp; {formatDate(note.createdAt)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <FaGlobe className="text-gray-600" />
                      <FaExpand className="text-gray-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{note.floor}</p>
                  <div className="my-2 bg-gray-200 p-2 rounded-md">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      note.priority === "High" ? "bg-red-200 text-red-800" :
                      note.priority === "Medium" ? "bg-yellow-200 text-yellow-800" :
                      "bg-green-200 text-green-800"
                    }`}>
                      {note.priority}
                    </span>
                  </div>
                  {note.imageUrls && note.imageUrls.length > 0 && (
                    <div className="my-2">
                      <img
                        src='/floor.jpg'
                        alt="Note Image"
                        className="rounded-md w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="my-2 flex flex-wrap gap-1">
                    {note.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{note.description}</p>
                  <p className="text-sm text-gray-600 mt-2">Assignee: {note.assignee}</p>
                  <p className="text-sm text-gray-600">Status: {note.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center mt-4">
              <div className="text-center flex flex-col justify-center max-w-md mx-auto">
                <p className="text-md">No Matches For Your Results</p>
                <Image src='/svg.jpg' width={300} height={300} alt="No results" className="mx-auto md:w-[73%]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpen && selectedNote && (
        <Dialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          widthClass="w-[900px]"
          isLeft={false}
          withBlur={true}
          padding="p-4"
        >
          <FieldNoteModalCardsModal onClose={() => setIsOpen(false)} note={selectedNote} />
        </Dialog>
      )}
    </>
  );
};

export default FieldNotesModal;