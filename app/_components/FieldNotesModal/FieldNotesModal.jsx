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
  const [isOpenConfirmDeleteDialog, setIsOpenConfirmDeleteDialog] =
    useState(false);
  const [forMeData, setForMeData] = useState(null); // Store API response for "For me"
  const [isFetching, setIsFetching] = useState(false); // State to track fetching status

  const notes = useSelector((state) => state.TaskSlice.tasks);
  const loading = useSelector((state) => state.TaskSlice.loading);
  const dispatch = useDispatch();
  const { data: session } = useSession(); // Get session data from next-auth

  // Extract authenticated user info from session
  useEffect(() => {
    if (session?.user) {
      setAuthenticatedUser(session.user.userData); // Assuming session contains 'userData'
    }
  }, [session]);

  // Fetch tasks when authenticatedUser changes
  useEffect(() => {
    if (authenticatedUser?._id) {
      dispatch(getTasks(authenticatedUser._id));
    }
  }, [dispatch, authenticatedUser?._id]);

  // Update previous count when notes change
  useEffect(() => {
    if (!loading && notes?.length > 0) {
      setPreviousCount(notes.length);
    }
  }, [notes, loading]);

  // API call function to filter tasks "For me"
  const handleForMeClick = async () => {
    if (!authenticatedUser?._id) {
      console.error("User ID is missing");
      return;
    }

    setIsFetching(true); // Set fetching state to true
    try {
      // Make API call to get tasks assigned to authenticated user
      const response = await fetch(
        `/api/New/getAssignedTasks?id=${authenticatedUser._id}`
      );
      const data = await response.json();
      setForMeData(data.data); // Store the response in state
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsFetching(false); // Reset fetching state
    }
  };

  // Handle "Go Back" to reset "For me" data and clear filters
  const handleGoBack = () => {
    setForMeData(null); // Reset "For me" data
    setActiveFilters([]); // Clear all filters
    setSearchParam(""); // Clear search
  };

  // Filter buttons with "For Me" option at the start
  const filterButtons = useMemo(
    () => [
      <button
        key="forMeButton"
        onClick={handleForMeClick}
        disabled={isFetching}
      >
        {isFetching ? "Loading..." : "For Me"}{" "}
        {/* Show "Loading..." when fetching */}
      </button>,
      "Tags",
      "Status",
      "Due date",
      "Assignee",
      "Date created",
      "Priority",
      "Creator",
    ],
    [handleForMeClick, isFetching]
  );

  // Filter notes based on active filters or "For me" data
  const filterNotes = useMemo(() => {
    if (forMeData) {
      // If "For Me" data is fetched, show it
      return forMeData;
    } else {
      // Otherwise, filter the full notes based on active filters and search
      return notes?.filter((note) => {
        let matchesSearch = true;
        let matchesFilters = true;

        // Search logic
        if (searchParam !== "") {
          const searchFields =
            activeFilters.length > 0 ? activeFilters : filterButtons;
          matchesSearch = searchFields.some((field) => {
            switch (field) {
              case "Assignee":
                return note?.assignee
                  .toLowerCase()
                  .includes(searchParam.toLowerCase());
              case "Tags":
                return note.tags.some((tag) =>
                  tag?.toLowerCase().includes(searchParam.toLowerCase())
                );
              case "Status":
                return note?.status
                  .toLowerCase()
                  .includes(searchParam.toLowerCase());
              case "Priority":
                return note?.priority
                  .toLowerCase()
                  .includes(searchParam.toLowerCase());
              case "Creator":
                return note?.username
                  .toLowerCase()
                  .includes(searchParam.toLowerCase());
              case "Due date":
                return (
                  note?.dueDate &&
                  new Date(note.dueDate)
                    .toLocaleDateString()
                    .includes(searchParam)
                );
              case "Date created":
                return new Date(note?.createdAt)
                  .toLocaleDateString()
                  .includes(searchParam);
              default:
                return (
                  note?.description
                    .toLowerCase()
                    .includes(searchParam.toLowerCase()) ||
                  note.room.toLowerCase().includes(searchParam.toLowerCase()) ||
                  note.floor.toLowerCase().includes(searchParam.toLowerCase())
                );
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
    }
  }, [notes, searchParam, activeFilters, authenticatedUser, forMeData]);

  // Handle card click to open the dialog
  const handleCardClick = (note) => {
    setSelectedNote(note);
    setIsOpen(true);
  };

  // Handle filter change
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setSearchParam("");
  };

  // Handle search change
  const handleSearchChange = (search) => {
    setSearchParam(search);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setActiveFilters([]);
    setSearchParam("");
  };

  return (
    <>
      <div className="bg-white h-full overflow-auto">
        {/* "Go Back" Button below the filters */}
        {forMeData && (
          <button
            className="mt-2 ml-5 p-2 text-xs bg-gray-300 rounded-md"
            onClick={handleGoBack}
          >
            Go Back
          </button>
        )}

        {/* "For Me" Button at the start */}
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

        {/* Cards Component to display the tasks */}
        <CardsComponent
          cards={filterNotes}
          onCardClick={handleCardClick}
          emptyStateMessage="No Matches For Your Results"
          isLoading={loading || isFetching} // Show loading spinner if either is fetching
          previousCount={previousCount}
        />
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
    </>
  );
}

export default FieldNotesModal;
