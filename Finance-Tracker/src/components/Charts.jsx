import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];


// ---------- Pie Chart ----------
export const SpendingPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey="amount"
        nameKey="category"
        cx="50%"
        cy="50%"
        outerRadius={90}
        label
      >
        {data.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
    </PieChart>
  </ResponsiveContainer>
);


// ---------- Bar Chart ----------
export const StatsBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />

      {/* FIXED KEY */}
      <XAxis dataKey="name" />

      <YAxis />
      <Tooltip formatter={(value) => value.toFixed(2)} />

      <Bar
        dataKey="value"
        fill="#6366f1"
        radius={[6, 6, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
);
