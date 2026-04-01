import Expense from "../models/expenseSchema/expense.schema.js";
import Group from "../models/groupSchema/group.schema.js";

export const createExpense = async (req, res) => {
  try {
    const { groupId, title, description, amount, paidBy, splitBetween } =
      req.body;

    if (!groupId || !title || !amount || !paidBy || !splitBetween?.length) {
      return res.status(400).json({
        success: false,
        message:
          "groupId, title, amount, paidBy and splitBetween are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user.toString() === req.user.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Only group members can add expenses",
      });
    }

    const groupMemberIds = group.members.map((member) => member.user.toString());

    // paidBy must be in group
    if (!groupMemberIds.includes(paidBy)) {
      return res.status(400).json({
        success: false,
        message: "paidBy must be a valid group member",
      });
    }

    // remove duplicates from splitBetween
    const uniqueSplitUsers = [...new Set(splitBetween)];

    if (!uniqueSplitUsers.length) {
      return res.status(400).json({
        success: false,
        message: "splitBetween cannot be empty",
      });
    }

    // every split member must belong to group
    const allValidMembers = uniqueSplitUsers.every((userId) =>
      groupMemberIds.includes(userId)
    );

    if (!allValidMembers) {
      return res.status(400).json({
        success: false,
        message: "All split members must be valid group members",
      });
    }

    // equal split calculation
    const splitAmount = Number((amount / uniqueSplitUsers.length).toFixed(2));

    const calculatedSplits = uniqueSplitUsers.map((userId) => ({
      user: userId,
      amount: splitAmount,
    }));

    // fix rounding issue
    const totalAssigned = calculatedSplits.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const difference = Number((amount - totalAssigned).toFixed(2));

    if (difference !== 0) {
      calculatedSplits[calculatedSplits.length - 1].amount = Number(
        (calculatedSplits[calculatedSplits.length - 1].amount + difference).toFixed(2)
      );
    }

    const expense = await Expense.create({
      group: groupId,
      title,
      description: description || "",
      amount,
      paidBy,
      createdBy: req.user.userId,
      splitType: "equal",
      splitBetween: calculatedSplits,
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate("group", "name groupCode")
      .populate("paidBy", "name email")
      .populate("createdBy", "name email")
      .populate("splitBetween.user", "name email");

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense: populatedExpense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user.toString() === req.user.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view these expenses",
      });
    }

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name email")
      .populate("createdBy", "name email")
      .populate("splitBetween.user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate(
      "members.user",
      "name email"
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user._id.toString() === req.user.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view balances of this group",
      });
    }

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name email")
      .populate("splitBetween.user", "name email");

    const balancesMap = {};

    for (const expense of expenses) {
      const paidById = expense.paidBy._id.toString();

      for (const split of expense.splitBetween) {
        const memberId = split.user._id.toString();

        if (memberId === paidById) continue;

        const key = `${memberId}_${paidById}`;

        if (!balancesMap[key]) {
          balancesMap[key] = {
            from: {
              _id: split.user._id,
              name: split.user.name,
              email: split.user.email,
            },
            to: {
              _id: expense.paidBy._id,
              name: expense.paidBy.name,
              email: expense.paidBy.email,
            },
            amount: 0,
          };
        }

        balancesMap[key].amount += split.amount;
      }
    }

    const balances = Object.values(balancesMap).map((item) => ({
      ...item,
      amount: Number(item.amount.toFixed(2)),
    }));

    return res.status(200).json({
      success: true,
      group: {
        _id: group._id,
        name: group.name,
        groupCode: group.groupCode,
      },
      balances,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};