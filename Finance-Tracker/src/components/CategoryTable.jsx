export default function CategoryTable({ categories = [] }) {

  const total = categories.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <table className="w-full text-left">
      
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600">
            Category
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600">
            Amount
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600">
            Percentage
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">

        {categories.length === 0 && (
          <tr>
            <td colSpan="3" className="px-6 py-6 text-center text-gray-400">
              No category data available
            </td>
          </tr>
        )}

        {categories.map((item, idx) => {
          const percent = total
            ? ((item.amount / total) * 100).toFixed(1)
            : 0;

          return (
            <tr key={idx} className="hover:bg-gray-50 transition">
              
              <td className="px-6 py-4 font-medium">
                {item.category}
              </td>

              <td className="px-6 py-4">
                ${Number(item.amount).toLocaleString()}
              </td>

              <td className="px-6 py-4">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                  {percent}%
                </span>
              </td>

            </tr>
          );
        })}

      </tbody>

    </table>
  );
}
