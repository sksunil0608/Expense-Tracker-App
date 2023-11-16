const Expense = require("../models/expenses");
const userController = require('../controllers/users');

function isInValidString(str) {
  return (str == undefined || str.length == 0) ? true : false

}
exports.getExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const expense = await Expense.findByPk(expenseId);
  res.json({ allExpenses: expense });
};
exports.getExpenses = async (req, res, next) => {
  const expenses = await req.user.getExpenses();
  const userTotalExpense = req.user.totalExpenses
  res.json({ allExpenses: expenses ,totalExpense:userTotalExpense});
};

exports.postAddExpense = async (req, res, next) => {
  const expenseName = req.body.expenseName;
  const price = req.body.price;
  const category = req.body.category;
  if(isInValidString(expenseName) ||isInValidString(price)||isInValidString(category)){
    return res.status(400).json({Error:"Bad Requese, Something Went Wrong"})
  }
  
  try {
    const response = await Expense.create({
      expenseName: expenseName,
      price: price,
      category: category,
      userId:req.user.id
    });

    const userTotalExpense = await req.user.totalExpenses
    if( userTotalExpense === 0 || userTotalExpense === null){
      req.user.totalExpenses = price
    }
    else{
      req.user.totalExpenses = req.user.totalExpenses + + price
    }

    await req.user.save()

    res.json({
      allExpenses: {
        id: response.id,
        expenseName: response.expenseName,
        price: response.price,
        category: response.category,
} });
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
    
    const expenses = await Expense.findAll({where:{userId:req.user.id}});
    if(req.user.id !=expenses[0].userId){
      return res.status(401).json({ Error: "Authentication Error!!" })
    }

    const response = await Expense.findByPk(expenseId);

    // Save the current price before updating the expense
    const previousPrice = response.price;

    response.expenseName = expenseName;
    response.price = price;
    response.category = category;

    await response.save();

    // Subtract the previous price from totalExpenses
    req.user.totalExpenses -= previousPrice;

    // Add the new price to totalExpenses
    req.user.totalExpenses = req.user.totalExpenses + + price;

    await req.user.save();

    res.json({ allExpenses: response });
  } catch (err) {
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

exports.deleteExpenses = async (req, res, next) => {
    try {
        const expenseId = req.params.expenseId;
        const expense = await Expense.findAll({
            attributes: ['id', 'price'],
            where: { id: expenseId, userId: req.user.id }
        });

        if (!expense || expense.length === 0) {
            return res.status(404).json({ Error: "Expense not found" });
        }

        const result = await expense[0].destroy();

        if (result === 0) {
            return res.status(404).json({ Error: "Nothing Found!!" });
        }

        if (req.user.totalExpenses !== null) {
            req.user.totalExpenses -= expense[0].price;
        }

        await req.user.save();

        res.json({ status: "Deleted Successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ Error: "Internal Server Error" });
    }
};

