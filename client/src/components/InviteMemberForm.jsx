import { useState } from "react";
import api from "../api/axios";

function InviteMemberForm({ groupId }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return alert("Email is required");
    }

    try {
      setLoading(true);

      const res = await api.post(`/groups/${groupId}/invite`, { email });

      alert(res.data.message || "Invite sent");
      setEmail("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to invite member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card form-inline" onSubmit={handleInvite}>
      <h3>Invite by Email</h3>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Invite"}
      </button>
    </form>
  );
}

export default InviteMemberForm;