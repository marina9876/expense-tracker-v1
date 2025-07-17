export default function BudgetGoal({ budget, expenses }) {
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = budget - totalSpent;

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">💰 Monthly Budget</h2>
      <p className="text-gray-600">Set Budget: ₹{budget}</p>
      <p className="text-green-600 font-bold">
        Remaining: ₹{remaining >= 0 ? remaining : 0}
      </p>
      {remaining < 0 && (
        <p className="text-red-500">You’ve exceeded your budget!</p>
      )}
    </div>
  );
}
