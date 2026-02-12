export default function SummaryCard({ title, value = 0, color }) {

  const formattedValue = Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color}`}>
      
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </p>

      <p className="text-2xl font-bold mt-2">
        ${formattedValue}
      </p>

    </div>
  );
}
