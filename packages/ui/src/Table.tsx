"use client";

interface TableProps {
    columns: string[];
    data: { [key: string]: string | number }[];
}

export const Table = ({ columns, data }: TableProps) => {
    return (
        <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white">
                    {/* Table Header */}
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="px-6 py-4 text-left text-sm font-medium uppercase">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b hover:bg-gray-100 transition">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 text-sm text-gray-700">
                                            {row[col] as string}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                                    No transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
