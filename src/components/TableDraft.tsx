import React from "react";

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
  console.log(data);
  const draftPosts = data?.filter(row => row.post_status === "draft");

  return (
    <div className="overflow-x-auto">
      <table className="table-auto mt-5 2lg:w-full w-[1200px]">
        <thead>
          <tr>
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
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-3 text-center">
                  {/* {col.Cell
                    ? col.Cell({ value: row[col.accessor], row })
                    : row[col.accessor]} */}
                  {col.accessor === "Publish" ?
                    (<button
                      onClick={() => onPublish(row)}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light3 hover:text-primary transition-colors"
                    >
                      {col.accessor}
                    </button>) :
                    col.accessor === "View Details" ?
                    (<button
                      onClick={() => onViewDetails(row)}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light3 hover:text-primary transition-colors"
                    >
                      {col.accessor}
                    </button>) :
                    row[col.accessor]
                    }
                </td>
              ))}
              
              {/* <td className="px-4 py-3 text-center">
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
