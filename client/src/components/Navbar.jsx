import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h2>Expense Share</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Navbar;