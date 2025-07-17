import { useState } from "react";

export default function ExpenseList({ expenses, onDelete, onEdit }) {
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ amount: "", note: "", category: "", date: "" });

  const startEditing = (index) => {
    setEditIndex(index);
    setForm(expenses[index]);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(editIndex, form);
    setEditIndex(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">🧾 Recent Expenses</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses added yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {expenses.map((exp, index) => (
            <li key={index} className="py-2 flex flex-col gap-2">
              {editIndex === index ? (
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                    className="border p-1 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Note"
                    className="border p-1 rounded"
                  />
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="border p-1 rounded"
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="border p-1 rounded"
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditIndex(null)}
                      className="bg-gray-300 px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{exp.category}</p>
                    <p className="text-sm text-gray-500">
                      {exp.note || "No note"} • {exp.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-semibold">-₹{exp.amount}</span>
                    <button
                      onClick={() => startEditing(index)}
                      className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(index)}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
