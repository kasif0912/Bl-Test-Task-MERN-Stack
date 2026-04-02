export const generateGroupCode = () => {
  return "GRP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const generateMemberCode = (group) => {
  const nextNumber = group.members.length + 1;
  return "MEM-" + String(nextNumber).padStart(3, "0");
};