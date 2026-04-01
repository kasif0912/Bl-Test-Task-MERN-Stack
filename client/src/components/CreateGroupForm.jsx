import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

function CreateGroupForm({ onGroupCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Grupp name is required");
    }

    try {
      setLoading(true);

      const res = await api.post("/groups/create", { name });
      // console.log(res.data);
      if (res.data) {
        toast.success("created successfully");
      }
      setName("");
      onGroupCreated(res.data.group);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create Gorup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card form-inline" onSubmit={handleCreateGroup}>
      <input
        type="text"
        placeholder="Enter group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Group"}
      </button>
    </form>
  );
}

export default CreateGroupForm;
