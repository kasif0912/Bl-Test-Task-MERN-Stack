function ExpenseList({ expenses }) {
    return (
      <div className="card">
        <h3>Expenses</h3>
  
        {expenses.length === 0 ? (
          <p>No expenses found</p>
        ) : (
          <div className="list">
            {expenses.map((expense) => (
              <div key={expense._id} className="list-item column">
                <strong>{expense.title}</strong>
                <p>{expense.description}</p>
                <p>Amount: ₹{expense.amount}</p>
                <p>Paid By: {expense.paidBy?.name}</p>
                <p>
                  Split Between:{" "}
                  {expense.splitBetween?.map((item) => item.user?.name).join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  export default ExpenseList;