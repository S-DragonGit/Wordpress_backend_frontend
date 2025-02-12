import React from "react";

interface Column {
  header: string;
  accessor: string;
  Cell?: (value: any) => React.ReactNode;
}

interface TableOneProps {
  columns: Column[];
  data: any[] | undefined;
  onViewDetails: (row: any) => void;
}

const TableNotification: React.FC<TableOneProps> = ({
  columns,
  data,
  onViewDetails,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto mt-5 2lg:w-full w-[1200px]">
        <thead>
          <tr>
            <th
                // key={index}
                className="px-4 py-3 text-center text-sm bg-primary-light2 font-medium"
              >
                <input type="checkbox" />
              </th>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-3 text-center text-sm bg-primary-light2 font-medium"
              >
                {col.header}
              </th>
            ))}
            <th className="px-4 py-3 text-center text-sm bg-primary-light2 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-border hover:bg-gray-100"
            >
              <td className="px-4 py-3 text-center">
                <input type="checkbox" />
              </td>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-3 text-center">
                  {col.Cell
                    ? col.Cell({ value: row[col.accessor], row })
                    : row[col.accessor]}
                </td>
              ))}
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onViewDetails(row)}
                  className={`bg-primary  px-4 py-2 rounded-md hover:bg-primary-light3 hover:text-primary text-white  transition-colors`}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableNotification;
