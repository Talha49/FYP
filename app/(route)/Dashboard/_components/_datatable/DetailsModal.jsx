import React from 'react';
import { X } from 'lucide-react';

/**
 * A reusable modal component for displaying detailed information in a table format
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {Function} props.onClose - Function to close the modal
 * @param {string} props.title - Title of the modal
 * @param {Array} props.columns - Array of column definitions
 * @param {Array} props.data - Data to be displayed in the table
 * @param {Function} [props.renderRow] - Optional custom row rendering function
 */
const DetailsModal = ({
  isOpen,
  onClose,
  title,
  columns,
  data,
  renderRow
}) => {
  if (!isOpen) return null;

  // Default row renderer if no custom renderer is provided
  const defaultRowRenderer = (item, index) => (
    <tr key={index} className="border-b hover:bg-gray-50">
      {columns.map((column, colIndex) => (
        <td key={colIndex} className="p-2">
          {column.accessor ? column.accessor(item) : item[column.key]}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-900"
          >
            <X />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {columns.map((column, index) => (
                  <th 
                    key={index} 
                    className="p-2 text-left"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              {data.map(renderRow || defaultRowRenderer)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;