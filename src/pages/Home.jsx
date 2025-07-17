import { useState } from "react";
import Header from "../components/Header";
import AddExpenseModal from "../components/AddExpenseModal";
import ExpenseList from "../components/ExpenseList";
import CalendarView from "../components/CalendarView";
import Insights from "../components/Insights";
import BudgetGoal from "../components/BudgetGoal";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(10000); // monthly budget
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [...prev, newExpense]);
  };

  const handleDeleteExpense = (index) => {
    setExpenses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditExpense = (index, updatedExpense) => {
    setExpenses((prev) =>
      prev.map((e, i) => (i === index ? updatedExpense : e))
    );
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <Header onAddExpenseClick={() => setShowModal(true)} />
      
      {/* Modal now controlled by showModal state */}
      <AddExpenseModal
        isOpen={showModal}
        onAddExpense={handleAddExpense}
        onClose={() => setShowModal(false)}
      />
      
      <BudgetGoal budget={budget} expenses={expenses} />
      <CalendarView expenses={expenses} />
      <ExpenseList
        expenses={expenses}
        onDelete={handleDeleteExpense}
        onEdit={handleEditExpense}
      />
      <Insights expenses={expenses} />
    </div>
  );
}