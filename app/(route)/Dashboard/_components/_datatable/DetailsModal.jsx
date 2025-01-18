import React, { useState } from "react";
import { X } from "lucide-react";
import Dialog from "@/app/_components/Dialog/Dialog";
import FieldNoteModalCardsModal from "@/app/_components/FieldNoteModalCardsModal/FieldNoteModalCardsModal";

const DetailsModal = ({
  isOpen,
  onClose,
  title,
  columns,
  data,
  renderRow,
  session,
  contextType,
}) => {
  const [isFieldCardNotesModalOpen, setIsFieldCardNotesModalOpen] =
    useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  console.log("Selected Row =>", selectedRow);
  console.log("Data ==>", data);

  if (!isOpen) return null;

  // Enhanced row renderer to handle row click
  const defaultRowRenderer = (item, index) => (
    <tr
      key={`row-${item.id || index}`} // Use `item.id` if available, fallback to `index`
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
      onClick={() => {
        setSelectedRow(item);
        setIsFieldCardNotesModalOpen(true);
      }}
    >
      {columns.map((column, colIndex) => {
        let cellContent;

        if (column.accessor) {
          // Use accessor function if defined
          cellContent = column.accessor(item);
        } else if (column.key === "isSocialLogin") {
          // Handle specific boolean logic
          cellContent = item[column.key] ? "Yes" : "No";
        } else if (column.key === "assignees") {
          // Handle array length for "assignees"
          cellContent = Array.isArray(item[column.key])
            ? item[column.key].length
            : "0";
        } else {
          // Default content or fallback to "N/A"
          cellContent = item[column.key] ?? "N/A";
        }

        return (
          <td
            key={`cell-${colIndex}`}
            className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate"
            title={typeof cellContent === "string" ? cellContent : ""}
          >
            {cellContent}
          </td>
        );
      })}
    </tr>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 truncate max-w-[80%]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-auto relative">
          {!data || data.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
              No data available
            </div>
          ) : (
            <table className="w-full table-auto border-collapse">
              {/* Table Header */}
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {data?.map(renderRow || defaultRowRenderer)}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {contextType === "Tasks" && ( // Render modal only if contextType is 'Tasks'
        <Dialog
          isOpen={isFieldCardNotesModalOpen}
          onClose={() => setIsFieldCardNotesModalOpen(false)}
          isLeft={false}
          widthClass="w-[950px]"
          padding="p-6"
        >
          <FieldNoteModalCardsModal
            note={selectedRow}
            onClose={() => setIsFieldCardNotesModalOpen(false)}
          />
        </Dialog>
      )}
    </div>
  );
};

export default DetailsModal;
