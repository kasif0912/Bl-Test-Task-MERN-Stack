import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import AddMemberSection from "../components/AddMemberSection";
import InviteMemberForm from "../components/InviteMemberForm";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import BalanceList from "../components/BalanceList";

function GroupDetails() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroup = async () => {
    const res = await api.get(`/groups/${groupId}`);
    setGroup(res.data.group);
  };

  const fetchExpenses = async () => {
    const res = await api.get(`/expenses/${groupId}`);
    setExpenses(res.data.expenses || []);
  };

  const fetchBalances = async () => {
    const res = await api.get(`/expenses/${groupId}/balances`);
    setBalances(res.data.balances || []);
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchGroup(), fetchExpenses(), fetchBalances()]);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load group details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [groupId]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (!group) {
    return <p className="loading">Group not found</p>;
  }

  return (
    <div>
      <Navbar />

      <div className="container">
        <div className="card">
          <h2>{group.name}</h2>
          <p>Group Code: {group.groupCode}</p>
          <p>Members: {group.members.length}</p>
        </div>

        <div className="card">
          <h3>Members</h3>
          <div className="list">
            {group.members.map((member) => (
              <div key={member.user._id} className="list-item">
                <div>
                  <strong>{member.user.name}</strong>
                  <p>{member.user.email}</p>
                </div>
                <span>{member.memberCode}</span>
              </div>
            ))}
          </div>
        </div>

        <AddMemberSection groupId={groupId} onMemberAdded={fetchAllData} />
        <InviteMemberForm groupId={groupId} />
        <ExpenseForm group={group} onExpenseCreated={fetchAllData} />
        <ExpenseList expenses={expenses} />
        <BalanceList balances={balances} />
      </div>
    </div>
  );
}

export default GroupDetails;