import React, { useState } from "react";
import { FaGlobe, FaExpand } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import Image from "next/image";
import ShimmerLoader from "../../FieldNotesModal/shimmer";
import Dialog from "../../Dialog/Dialog";
import { IoClose } from "react-icons/io5";
import { useToast } from "../../CustomToast/Toast";

const CardsComponent = ({
  cards,
  onCardClick,
  renderCustomContent,
  emptyStateMessage = "No results found",
  emptyStateImage = "/svg.jpg",
  isLoading = false,
  previousCount = 0,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  const [isOpenConfirmDeleteDialog, setIsOpenConfirmDeleteDialog] =
    useState(false);
  const [answer, setAnswer] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  // console.log("ID =>", deletingTaskId);
  // console.log("Answer =>", answer);

  const handleDeleteTask = async () => {
    try {
      if (answer === true) {
        setIsDeleting(true);
        const response = await fetch(`/api/New/DeleteTask/${deletingTaskId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log(response);
          setIsDeleting(false);
          showToast("Failed to delete task", "error");
          throw new Error("Failed to delete task");
        }
        onCardClick(null);
        setIsOpenConfirmDeleteDialog(false);
        setAnswer(false);
        setDeletingTaskId("");
        setIsDeleting(false);
        showToast("Task deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
      setIsDeleting(false);
      showToast("Failed to delete task", "error");
    }
  };

  if (isLoading) {
    // Use either the previous count of cards or the current count
    const expectedCount = previousCount || cards?.length || 0;
    return <ShimmerLoader expectedCount={expectedCount} />;
  }
  if (cards?.length === 0) {
    return (
      <div className="flex justify-center mt-4">
        <div className="text-center flex flex-col justify-center max-w-md mx-auto">
          <p className="text-md">{emptyStateMessage}</p>
          <Image
            src={emptyStateImage}
            width={300}
            height={300}
            alt="No results"
            className="mx-auto md:w-[73%]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards?.map((card) => (
        <div
          key={card._id}
          className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-center relative">
            <div>
              <h3 className="font-semibold">{card.username}</h3>
              <p className="text-sm text-gray-600">
                <b> Room:</b> {card.room} &nbsp;&nbsp; <b>Ceated At:</b>{" "}
                {formatDate(card.createdAt)}
              </p>
            </div>
            <div className="flex space-x-2 items-center absolute top-0 right-0">
              {/* <FaGlobe className="text-gray-600" /> */}
              <FaExpand
                className="text-gray-600 cursor-pointer hover:text-blue-500 hover:scale-110 transition-all"
                onClick={() => onCardClick(card)}
              />
              <MdOutlineDelete
                className="text-gray-600 text-xl cursor-pointer hover:text-red-500 hover:rotate-12 transition-all"
                onClick={() => {
                  setIsOpenConfirmDeleteDialog(true);
                  setDeletingTaskId(card._id);
                }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            <b>Floor:</b> {card.floor}
          </p>
          <div className="my-2 bg-gray-200 p-2 rounded-md">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                card.priority === "High"
                  ? "bg-red-200 text-red-800"
                  : card.priority === "Medium"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {card.priority}
            </span>
          </div>
          {card.groundFloorImages && card.groundFloorImages.length > 0 && (
            <div className="my-2 relative w-full h-48">
              <Image
                src={card.groundFloorImages[0].url}
                alt="Ground Floor Image"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          )}
          <div className="my-2 flex flex-wrap gap-1">
            {card.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2 my-2 bg-gray-200 p-2 rounded-md">
            {card.description}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <b>Assignee:</b> {card.assignee}
          </p>
          <p className="text-sm text-gray-600">
            <b>Status:</b> {card.status}
          </p>
          <p className="text-sm text-gray-600">
            <b>Due:</b> {formatDate(card.dueDate)}
          </p>

          {renderCustomContent && renderCustomContent(card)}
        </div>
      ))}
      {/* Confirm Delete Dialog */}
      {isOpenConfirmDeleteDialog && (
        <div className="fixed left-0 top-0 z-50 h-screen w-full animate-fade-in bg-black bg-opacity-75 flex items-center justify-center">
          <div className="w-[500px] bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-end w-full">
              <button
                onClick={() => {
                  setIsOpenConfirmDeleteDialog(false);
                }}
              >
                <IoClose />
              </button>
            </div>
            <h1 className="text-xl font-semibold">Are you sure!</h1>
            <p>Do you want to delete permanently?</p>
            <div className="flex justify-end gap-2">
              <button
                disabled={isDeleting}
                className="border border-blue-500 bg-blue-50 text-blue-500 shadow-md rounded px-2 py-1 disabled:cursor-not-allowed"
                onClick={() => {
                  setIsOpenConfirmDeleteDialog(false);
                  setAnswer(false);
                  setDeletingTaskId("");
                }}
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                className="bg-blue-500 text-white rounded shadow-md px-2 py-1 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setAnswer(true);
                  handleDeleteTask();
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsComponent;
