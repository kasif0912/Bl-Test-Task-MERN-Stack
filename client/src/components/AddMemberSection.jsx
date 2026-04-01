import { useEffect, useState } from "react";
import api from "../api/axios";

function AddMemberSection({ groupId, onMemberAdded }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (value = "") => {
    try {
      setLoading(true);

      const res = await api.get(`/user?groupId=${groupId}&search=${value}`);
      setUsers(res.data.users || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [groupId]);

  const handleAddMember = async (email) => {
    try {
      await api.post(`/groups/${groupId}/add-member`, { email });
      alert("Member added successfully");
      fetchUsers(search);
      onMemberAdded();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add member");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchUsers(value);
  };

  return (
    <div className="card">
      <h3>Add Existing Users</h3>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={handleSearch}
      />

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users available</p>
      ) : (
        <div className="list">
          {users.map((user) => (
            <div key={user._id} className="list-item">
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              <button onClick={() => handleAddMember(user.email)}>Add</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddMemberSection;