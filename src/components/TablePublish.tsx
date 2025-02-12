import React from "react";

interface Column {
  header: string;
  accessor: string;
  Cell?: (value: any) => React.ReactNode;
}

interface TablePublishProps {
  columns: Column[];
  data: any[] | undefined;
  onViewDetails: (row: any) => void;
  onViewReviews: (row: any) => void;
}


const TablePublish: React.FC<TablePublishProps> = ({
  columns,
  data,
  onViewDetails,
  onViewReviews,
}) => {
  const publishPosts = data?.filter((row) => row.post_status === "publish");

  // const [parentChecked, setParentChecked] = useState(false);
  // const [items, setItems] = useState<any>([
  // ]);

  // const handleParentChange = (checked: boolean) => {
  //   setParentChecked(checked);
  //   setItems(items.map(item => ({ ...item, checked })));
  // };

  // const handleItemChange = (itemId: string, checked: boolean) => {
  //   const updatedItems = items.map(item =>
  //     item.id === itemId ? { ...item, checked } : item
  //   );
  //   setItems(updatedItems);
  //   setParentChecked(updatedItems.every(item => item.checked));
  // };

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
          </tr>
        </thead>
        <tbody className="bg-white">
          {publishPosts?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-border hover:bg-gray-100"
            >
              <td className="px-4 py-3 text-center">
                <input type="checkbox" />
              </td>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-3 text-center">
                  {/* {col.Cell
                    ? col.Cell({ value: row[col.accessor], row })
                    : row[col.accessor]} */}
                  {col.accessor === "View Full Details" ? (
                    <button
                      onClick={() => onViewDetails(row)}
                      className="px-4 py-2 rounded-md"
                    >
                      {col.accessor}
                    </button>
                  ) : col.accessor === "Survey Results" ? (
                    <button
                      disabled
                      onClick={() => onViewReviews(row)}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light3 hover:text-primary transition-colors"
                    >
                      {col.accessor}
                    </button>
                  ) : (
                    row[col.accessor]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePublish;
