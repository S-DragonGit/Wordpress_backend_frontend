import React from 'react';


interface Column {
    header: string;
    accessor: string;
    Cell?: (value: any) => React.ReactNode;
}

interface TableOneProps {
    columns: Column[];
    data: any[] | undefined;
}

const TableOne: React.FC<TableOneProps> = ({ columns, data }) => {
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
                    {data?.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b cursor-pointer border-gray-border hover:bg-gray-100"
                        >
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="px-4 py-3">
                                    {col.Cell ? (
                                        col.Cell({ value: row[col.accessor], row })
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

export default TableOne;