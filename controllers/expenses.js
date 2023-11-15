const Expense = require("../models/expenses");


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
  res.json({ allExpenses: expenses });
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
    if(req.user.id !=expenses[0].id){
      return res.status(401).json({ Error: "Authentication Error!!" })
    }

    const response = await Expense.findByPk(expenseId);
    response.expenseName = expenseName;
    response.price = price;
    response.category = category;

    await response.save();
    res.json({ allExpenses: response });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpenses = async (req, res, next) => {
  try{
    const expenseId = req.params.expenseId;
    const result = await Expense.destroy({ where: { id: expenseId, userId: req.user.id } });

    if (result === 0) {
      return res.status(404).json({ Error: "Nothing Found!!" })
    }
    res.json({ status: "Deleted Successfully" });
  }
  catch(err){
    return res.status(404).json({ Error: "Nothing Found!!" })
  }
  
};
