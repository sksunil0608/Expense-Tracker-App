const Expense = require("../models/expenses");
const sequelize = require('../util/database')
const UserService = require('../services/userservices')
const S3Service = require('../services/S3Services')

function isInValidString(str) {
  return (str == undefined || str.length == 0) ? true : false
}

exports.downloadReport = async (req,res)=>{
  const t= await sequelize.transaction();
  try{
    const expenses = await UserService.getExpenses(req)
    const stringifiedExpense = JSON.stringify(expenses)
    const fileName = `Expense-${req.user.name}`
    const fileType = `.txt`;
    const filePath = `${fileName}/${new Date()}${fileType}`
    const fileURL = await S3Service.uploadtoS3(stringifiedExpense,filePath);

    await req.user.createDownloadLog({
      fileName: fileName,
      filePath: filePath,
      fileURL: fileURL,
      fileType:fileType},
      {transaction:t}
      )
    await t.commit();
    res.status(201).json({fileURL:fileURL})

  }catch(err){
    await t.rollback();
    console.log(err)
    res.status(401).json({"Authorization Errror":"User is not authorized to Download"})
  }
}

exports.getAllDownloadHistory = async (req,res)=>{
    try{
      const response = await req.user.getDownloadLogs();
      res.status(201).json({downloadHistory:response})
    }catch(err){
      res.status(500).json({ Error: "Internal Server Error" });
    }
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
  const t = await sequelize.transaction();

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
      userId:req.user.id},
      {transaction:t}
      );

    const userTotalExpense = await req.user.totalExpenses
    if( userTotalExpense === 0 || userTotalExpense === null){
      req.user.totalExpenses = price
    }
    else{
      req.user.totalExpenses = req.user.totalExpenses + + price
    }

    await req.user.save({transaction:t})

    await t.commit(); 

    res.json({
      allExpenses: {
        id: response.id,
        expenseName: response.expenseName,
        price: response.price,
        category: response.category,
} });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

exports.postEditExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  const expenseId = req.params.expenseId;
  const expenseName = req.body.expenseName;
  const price = req.body.price;
  const category = req.body.category;
  try {
    
    const expenses = await Expense.findAll({where:{userId:req.user.id},transaction:t});
    if(req.user.id !=expenses[0].userId){
      return res.status(401).json({ Error: "Authentication Error!!" })
    }

    const response = await Expense.findByPk(expenseId,{transaction:t});

    // Save the current price before updating the expense
    const previousPrice = response.price;

    response.expenseName = expenseName;
    response.price = price;
    response.category = category;

    await response.save({transaction:t});

    // Subtract the previous price from totalExpenses
    req.user.totalExpenses -= previousPrice;

    // Add the new price to totalExpenses
    req.user.totalExpenses = req.user.totalExpenses + + price;

    await req.user.save({transaction:t});
    await t.commit();
    res.json({ allExpenses: response });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

exports.deleteExpenses = async (req, res, next) => {
  const t = await sequelize.transaction();
    try {
        const expenseId = req.params.expenseId;
        const expense = await Expense.findAll({
            attributes: ['id', 'price'],
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

        if (req.user.totalExpenses !== null) {
            req.user.totalExpenses -= expense[0].price;
        }

        await req.user.save({transaction:t});
        await t.commit();
        res.json({ status: "Deleted Successfully" });
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ Error: "Internal Server Error" });
    }
};

