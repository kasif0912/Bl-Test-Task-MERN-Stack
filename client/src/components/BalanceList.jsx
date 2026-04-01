function BalanceList({ balances }) {
    return (
      <div className="card">
        <h3>Balances</h3>
  
        {balances.length === 0 ? (
          <p>No balances found</p>
        ) : (
          <div className="list">
            {balances.map((item, index) => (
              <div key={index} className="list-item column">
                <p>
                  <strong>{item.from.name}</strong> owes{" "}
                  <strong>{item.to.name}</strong>
                </p>
                <p>Amount: ₹{item.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  export default BalanceList;