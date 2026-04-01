import { useState } from "react";
import api from "../api/axios";

function ExpenseForm({ group, onExpenseCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !amount || !paidBy || selectedMembers.length === 0) {
      return alert("Please fill all required fields");
    }

    try {
      setLoading(true);

      await api.post("/expenses/create", {
        groupId: group._id,
        title,
        description,
        amount: Number(amount),
        paidBy,
        splitBetween: selectedMembers,
      });

      setTitle("");
      setDescription("");
      setAmount("");
      setPaidBy("");
      setSelectedMembers([]);

      alert("Expense added successfully");
      onExpenseCreated();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Add Expense</h3>

      <input
        type="text"
        placeholder="Expense title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="">Select payer</option>
        {group.members.map((member) => (
          <option key={member.user._id} value={member.user._id}>
            {member.user.name}
          </option>
        ))}
      </select>

      <div className="member-checkboxes">
        <p>Select members to split:</p>
        {group.members.map((member) => (
          <label key={member.user._id} className="checkbox-row">
            <input
              type="checkbox"
              checked={selectedMembers.includes(member.user._id)}
              onChange={() => handleCheckboxChange(member.user._id)}
            />
            {member.user.name}
          </label>
        ))}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Expense"}
      </button>
    </form>
  );
}

export default ExpenseForm;