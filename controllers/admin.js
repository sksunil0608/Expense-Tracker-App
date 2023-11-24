const Expense = require("../models/expense");
const sequelize = require('../util/database')
const UserService = require('../services/userservice')
const S3Service = require('../services/S3Service')
const path = require('path')

function isInValidString(str) {
  return (str == undefined || str.length == 0) ? true : false
}

exports.getadminDashboardView = (req,res)=>{
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
}

exports.getExpenseReportView = (req, res) => {
    return res.sendFile(path.join(__dirname, '..', 'public', 'expense-report.html'));
}


exports.getDownloadReport = async (req,res)=>{
  const t= await sequelize.transaction();
  // file_path
  try{
    const expenses = await UserService.getExpenses(req)
    const stringified_expense = JSON.stringify(expenses)
    const file_name = `Expense-${req.user.name}`
    const file_type = `.txt`;
    const file_path = `${file_name}/${new Date()}${file_type}`
    const file_url = await S3Service.uploadtoS3(stringified_expense,file_path);

    await req.user.createDownload_log({
      file_name: file_name,
      file_path: file_path,
      file_url: file_url,
      file_type:file_type},
      {transaction:t}
      )
    await t.commit();
    res.status(201).json({file_url:file_url})

  }catch(err){
    await t.rollback();
    console.log(err)
    res.status(401).json({"Authorization Errror":"User is not authorized to Download"})
  }
}

exports.getAllDownloadHistory = async (req,res)=>{
    try{
      const response = await req.user.getDownload_logs();
      res.status(201).json({download_history:response})
    }catch(err){
      console.log(err)
      res.status(500).json({ Error: "Internal Server Error" });
    }
}
exports.getExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const expense = await Expense.findByPk(expenseId);
  res.json({ all_expenses: expense });
};

exports.getExpenses = async (req, res, next) => {
  const page = req.query.page || 1  
  const items_per_page = parseInt(req.query.items_per_page) || 10
  const offset = (page - 1) * items_per_page; 
  try{
  const expenses = await req.user.getExpenses({offset:offset,limit:items_per_page});
  const total_expenses = await req.user.total_expenses
  const totalPages = Math.ceil(total_expenses/items_per_page)
  const user_total_expense_amount = await req.user.total_expense_amount
  res.json({ all_expenses: expenses ,total_expense:user_total_expense_amount,totalPages:totalPages});
  }
  catch(err){
    console.log(err)
    res.status(500).json({Error:"Internal Server Error"})
  }
};

exports.postAddExpense = async (req, res, next) => {
  const t = await sequelize.transaction();

  const expense_name = req.body.expense_name;
  const expense_price = req.body.expense_price;
  const expense_category = req.body.expense_category;
  if(isInValidString(expense_name) ||isInValidString(expense_price)||isInValidString(expense_category)){
    return res.status(400).json({Error:"Bad Requese, Something Went Wrong"})
  }
  
  try {
    const response = await Expense.create({
      expense_name: expense_name,
      expense_price: expense_price,
      expense_category: expense_category,
      userId:req.user.id},
      {transaction:t}
      );

    const user_total_expense_amount = await req.user.total_expense_amount
    const user_total_expenses = await req.user.total_expenses
    if( user_total_expense_amount === 0 || user_total_expense_amount === null||user_total_expenses==0 ||user_total_expenses==null){
      req.user.total_expense_amount = expense_price
      req.user.total_expenses = 1
    }
    else{
      req.user.total_expense_amount = req.user.total_expense_amount + + expense_price
      req.user.total_expenses = req.user.total_expenses + + 1
    }
    await req.user.save({transaction:t})

    await t.commit(); 

    res.json({
      all_expenses: {
        id: response.id,
        expense_name: response.expense_name,
        expense_price: response.expense_price,
        expense_category: response.expense_category,
} });
  } catch (err) {
    console.log(err)
    await t.rollback();
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

exports.postEditExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  const expenseId = req.params.expenseId;
  const expense_name = req.body.expense_name;
  const expense_price = req.body.expense_price;
  const expense_category = req.body.expense_category;
  try {
    
    const expenses = await Expense.findAll({where:{userId:req.user.id},transaction:t});
    if(req.user.id !=expenses[0].userId){
      return res.status(401).json({ Error: "Authentication Error!!" })
    }

    const response = await Expense.findByPk(expenseId,{transaction:t});

    // Save the current expense_price before updating the expense
    const previousPrice = response.expense_price;

    response.expense_name = expense_name;
    response.expense_price = expense_price;
    response.expense_category = expense_category;

    await response.save({transaction:t});

    // Subtract the previous expense_price from total_expensess
    req.user.total_expense_amount -= previousPrice;

    // Add the new expense_price to total_expensess
    req.user.total_expense_amount = req.user.total_expense_amount + + expense_price;

    await req.user.save({transaction:t});
    await t.commit();
    res.json({ all_expenses: response });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

exports.postdeleteExpenses = async (req, res, next) => {
  const t = await sequelize.transaction();
    try {
        const expenseId = req.params.expenseId;
        const expense = await Expense.findAll({
            attributes: ['id', 'expense_price'],
            where: { id: expenseId, userId: req.user.id },
            transaction:t
        });

        if (!expense || expense.length === 0) {
            return res.status(404).json({ Error: "Expense not found" });
        }

        const result = await expense[0].destroy({transaction:t});

        if (result === 0) {
            return res.status(404).json({ Error: "Nothing Found!!" });
        }

        if (req.user.total_expense_amount !== null || req.user.total_expenses != null) {
            req.user.total_expense_amount -= expense[0].expense_price;
            req.user.total_expenses -= 1
        }

        await req.user.save({transaction:t});
        await t.commit();
        res.json({ status: "Deleted Successfully" });
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ Error: "Internal Server Error" });
    }
};

