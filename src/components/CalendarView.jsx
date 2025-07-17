export default function CalendarView({ expenses }) {
  const grouped = {};

  expenses.forEach((e) => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });

  const dates = Object.keys(grouped).sort().reverse();

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">📆 Calendar View</h2>
      {dates.length === 0 ? (
        <p className="text-gray-500">No expenses to show.</p>
      ) : (
        dates.map((date) => (
          <div key={date} className="mb-3">
            <h3 className="text-sm font-bold text-indigo-600">{date}</h3>
            <ul className="pl-4 list-disc text-sm text-gray-700">
              {grouped[date].map((e, i) => (
                <li key={i}>
                  ₹{e.amount} – {e.category} {e.note && `(${e.note})`}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
