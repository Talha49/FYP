import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "@/lib/Features/TaskSlice";
import CardsComponent from "../HOC/Cards/CardsComponent";
import FilterSearchComponent from "../HOC/Filters/FilterSearchComponent";
import { useSession } from "next-auth/react";
import Dialog from "../Dialog/Dialog";
import FieldNoteModalCardsModal from "../FieldNoteModalCardsModal/FieldNoteModalCardsModal";

function FieldNotesModal({ onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [previousCount, setPreviousCount] = useState(0);
  const notes = useSelector((state) => state.TaskSlice.tasks);
  const loading = useSelector((state) => state.TaskSlice.loading);
  const [isOpenConfirmDeleteDialog, setIsOpenConfirmDeleteDialog] = useState(false);

  const dispatch = useDispatch();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setAuthenticatedUser(session?.user?.userData);
    }
  }, [session]);

  useEffect(() => {
    if (authenticatedUser?.id) {
      dispatch(getTasks(authenticatedUser.id));
    }
  }, [dispatch, authenticatedUser?.id]);

  useEffect(() => {
    if (!loading && notes?.length > 0) {
      setPreviousCount(notes.length);
    }
  }, [notes, loading]);


  const filterButtons = [
    "For me",
    "Tags",
    "Status",
    "Due date",
    "Assignee",
    "Date created",
    "Priority",
    "Creator",
  ];

  const filterNotes = useMemo(() => {
    return notes?.filter((note) => {
      let matchesSearch = true;
      let matchesFilters = true;

      // Search logic
      if (searchParam !== "") {
        const searchFields = activeFilters.length > 0 ? activeFilters : filterButtons;
        matchesSearch = searchFields.some(field => {
          switch (field) {
            case "Assignee":
              return note.assignee.toLowerCase().includes(searchParam.toLowerCase());
            case "Tags":
              return note.tags.some(tag => tag.toLowerCase().includes(searchParam.toLowerCase()));
            case "Status":
              return note.status.toLowerCase().includes(searchParam.toLowerCase());
            case "Priority":
              return note.priority.toLowerCase().includes(searchParam.toLowerCase());
            case "Creator":
              return note.username.toLowerCase().includes(searchParam.toLowerCase());
            case "Due date":
              return note.dueDate && new Date(note.dueDate).toLocaleDateString().includes(searchParam);
            case "Date created":
              return new Date(note.createdAt).toLocaleDateString().includes(searchParam);
            default:
              return note.description.toLowerCase().includes(searchParam.toLowerCase()) ||
                     note.room.toLowerCase().includes(searchParam.toLowerCase()) ||
                     note.floor.toLowerCase().includes(searchParam.toLowerCase());
          }
        });
      }

      // Filter logic
      matchesFilters = activeFilters.every((filter) => {
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
          case "For me":
            return note.assignee === authenticatedUser?.fullName;
          case "Creator":
            return note.username === authenticatedUser?.username;
          default:
            return true;
        }
      });

      return matchesSearch && matchesFilters;
    });
  }, [notes, searchParam, activeFilters, authenticatedUser]);

  const handleCardClick = (note) => {
    setSelectedNote(note);
    setIsOpen(true);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setSearchParam(""); 
  };

  const handleSearchChange = (search) => {
    setSearchParam(search);
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    setSearchParam("");
  };

  return (
    <>
      <div className="bg-white h-full overflow-auto">
        <FilterSearchComponent
          title="FieldNotes"
          onClose={onClose}
          searchParam={searchParam}
          setSearchParam={handleSearchChange}
          activeFilters={activeFilters}
          setActiveFilters={handleFilterChange}
          filterButtons={filterButtons}
          resultCount={filterNotes?.length}
          onClearFilters={handleClearFilters}
        />

        <div className="p-4">
          <CardsComponent
            cards={filterNotes}
            onCardClick={handleCardClick}
            isOpenConfirmDeleteDialog={isOpenConfirmDeleteDialog}
            emptyStateMessage="No Matches For Your Results"
            isLoading={loading}
            previousCount={previousCount}

          />
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
          <FieldNoteModalCardsModal
            onClose={() => setIsOpen(false)}
            note={selectedNote}
            token={authenticatedUser?.token}
          />
        </Dialog>
      )}

      {isOpenConfirmDeleteDialog && (
        <Dialog
        >
          <h1>Are You Sure!</h1>
          <p>Do you want to delete?</p>
        </Dialog>
      )}
    </>
  );
};

export default FieldNotesModal;
