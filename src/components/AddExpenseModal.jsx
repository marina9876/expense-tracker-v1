import { useState, useEffect, useRef } from "react";
import { categories } from "../constants/categories"; // Now properly imported

export default function AddExpenseModal({ onAddExpense, onClose }) {
  // State management
  const [form, setForm] = useState({
    note: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Auto-focus and keyboard handling
  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Amount validation
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setForm({...form, amount: value});
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!form.note.trim()) throw new Error("Description is required");
      if (!form.amount) throw new Error("Amount is required");
      if (parseFloat(form.amount) <= 0) throw new Error("Amount must be positive");

      // API call
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: form.note }),
      });

      if (!res.ok) throw new Error(await res.text() || "Prediction failed");
      const data = await res.json();

      // Create expense
      onAddExpense({
        note: form.note.trim(),
        amount: parseFloat(form.amount),
        date: form.date,
        category: data.category || "other"
      });

      // Reset form
      setForm({ note: '', amount: '', date: new Date().toISOString().split('T')[0] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-pop-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add Expense</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                ref={inputRef}
                type="text"
                value={form.note}
                onChange={(e) => setForm({...form, note: e.target.value})}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Dinner at restaurant"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                <input
                  type="text"
                  value={form.amount}
                  onChange={handleAmountChange}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="0.00"
                  inputMode="decimal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({...form, date: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2"
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}