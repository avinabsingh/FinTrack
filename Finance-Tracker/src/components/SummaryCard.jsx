import { motion } from "framer-motion";

export default function SummaryCard({ title, value = 0, color }) {
  const formattedValue = Number(value).toLocaleString();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {title}
      </p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>
        ${formattedValue}
      </p>
      <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "70%" }} 
          className={`h-full ${color.replace('text', 'bg')}`}
        />
      </div>
    </motion.div>
  );
}