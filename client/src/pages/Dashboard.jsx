import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import CreateGroupForm from "../components/CreateGroupForm";
import { toast } from "react-hot-toast";

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/groups/my-groups");
      setGroups(res.data.groups || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container">
        <CreateGroupForm onGroupCreated={fetchGroups} />

        <div className="card">
          <h2>My Groups</h2>

          {loading ? (
            <p>Loading...</p>
          ) : groups.length === 0 ? (
            <p>No groups found</p>
          ) : (
            <div className="group-list">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="group-item"
                  onClick={() => navigate(`/groups/${group._id}`)}
                >
                  <h3>{group.name}</h3>
                  <p>Code: {group.groupCode}</p>
                  <p>Members: {group.members.length}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
