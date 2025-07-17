export default function Insights({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const categoryTotals = {};
  expenses.forEach((e) => {
    const cat = e.category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount);
  });

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">📊 Spending Insights</h2>
      <p className="font-bold text-gray-700 mb-2">Total Spent: ₹{total}</p>
      <ul className="text-sm text-gray-700 list-disc pl-4">
        {Object.entries(categoryTotals).map(([cat, amt], i) => (
          <li key={i}>
            {cat}: ₹{amt}
          </li>
        ))}
      </ul>
    </div>
  );
}
