import React from "react";
import { useState } from "react"
import { format } from "date-fns";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : format(date, "MMM d, yyyy"); 
};

interface Column {
  header: string;
  accessor: string;
  Cell?: (value: any) => React.ReactNode;
}

interface TableDraftProps {
  columns: Column[];
  data: any[] | undefined;
  onPublish: (row: any) => void;
  onViewDetails: (row: any) => void;
}

const TableDraft: React.FC<TableDraftProps> = ({ columns, data, onPublish, onViewDetails }) => {
  const draftPosts = data?.filter((row) => row.post_status === "draft") || [];
  const [selectedRows, setSelectedRows] = useState<{ [key: number]: boolean }>({})
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    const newSelectedRows: { [key: number]: boolean } = {}
    draftPosts.forEach((_, index) => {
      newSelectedRows[index] = newSelectAll
    })
    setSelectedRows(newSelectedRows)
  }

  const handleSelectRow = (rowIndex: number) => {
    const newSelectedRows = {
      ...selectedRows,
      [rowIndex]: !selectedRows[rowIndex],
    }
    setSelectedRows(newSelectedRows)

    // Update selectAll state based on whether all rows are selected
    const allSelected = draftPosts.every((_, index) => newSelectedRows[index])
    setSelectAll(allSelected)
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto mt-5 2lg:w-full w-[1200px]">
        <thead>
          <tr>
            <th
                // key={index}
                className="px-4 py-3 text-center text-sm bg-primary-light2 font-medium"
              >
                <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 cursor-pointer"
              />
              </th>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-3 text-center text-sm bg-primary-light2 font-medium"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {draftPosts?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-border hover:bg-gray-100"
            >
              <td className="px-4 py-3 text-center">
              <input
                  type="checkbox"
                  checked={selectedRows[rowIndex] || false}
                  onChange={() => handleSelectRow(rowIndex)}
                  className="w-4 h-4 cursor-pointer"
                />
              </td>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-3 text-center">
                {col.accessor === "post_date" || col.accessor === "_EventStartDate" ? (
                  formatDate(row[col.accessor]) // Correctly format the actual date value
                ) : col.accessor === "Publish" ? (
                  <button
                  onClick={() => onPublish(row)}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light3 hover:text-primary transition-colors"
                >
                  Publish
                </button>
                ) : col.accessor === "View Full Details" ? (<button
                  onClick={() => onViewDetails(row)}
                  className="px-4 py-2 rounded-md bg-primary-light3 hover:bg-primary-light"
                >
                  {col.accessor}
                </button>) :
                row[col.accessor]
                }
              </td>
              ))}
{/*               
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onPublish(row)}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light3 hover:text-primary transition-colors"
                >
                  Publish
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableDraft;
