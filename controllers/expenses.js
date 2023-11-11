const Expense = require("../models/expenses");

exports.getExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const expense = await Expense.findByPk(expenseId);
  res.json({ allExpenses: expense });
};
exports.getExpenses = async (req, res, next) => {
  const expenses = await Expense.findAll();
  res.json({ allExpenses: expenses });
};

exports.postAddExpense = async (req, res, next) => {
  const expenseName = req.body.expenseName;
  const price = req.body.price;
  const category = req.body.category;
  try {
    const response = await Expense.create({
      expenseName: expenseName,
      price: price,
      category: category,
    });
    res.json({ allExpenses: response });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;

  const expenseName = req.body.expenseName;
  const price = req.body.price;
  const category = req.body.category;
  try {
    const response = await Expense.findByPk(expenseId);
    response.expenseName = expenseName;
    response.price = price;
    response.category = category;

    response.save();
    res.json({ allExpenses: response });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpenses = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  await Expense.destroy({ where: { id: expenseId } });
  res.json({ status: "Deleted Successfully" });
};
