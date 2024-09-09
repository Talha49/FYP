import React from 'react';
import { LiaSortSolid } from "react-icons/lia";

const Table = ({ headers, data, onSort, sortField, sortOrder }) => {
  return (
    <div className="min-w-full overflow-x-auto">
      <table className="w-full border-collapse border min-w-[1000px]">
        <thead className="text-sm font-medium text-gray-600">
          <tr className="bg-gray-200">
            {headers.map((header, index) => (
              <td
                key={index}
                className="border p-2 text-left"
                style={{ cursor: header.sortable ? 'pointer' : 'default' }}
              >
                <div className="flex justify-between items-center">
                  {header.label}
                  {header.sortable && (
                    <LiaSortSolid
                      onClick={() => onSort && onSort(header.key)}
                      className={sortField === header.key ? (sortOrder === 'asc' ? 'text-blue-500' : 'text-blue-500 rotate-180') : ''}
                    />
                  )}
                </div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {headers.map((header, cellIndex) => (
                <td key={cellIndex} className="border p-2">
                  {row[header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;