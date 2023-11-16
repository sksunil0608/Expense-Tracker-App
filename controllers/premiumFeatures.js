const Expense = require('../models/expenses')
const User = require('../models/users');

exports.getLeaderboard = async (req, res) => {
    try {
        const expenses = await Expense.findAll();
        userTotalExpense={}
        expenses.forEach((expense)=>{
            if(userTotalExpense[expense.userId]){
                userTotalExpense[expense.userId] = userTotalExpense[expense.userId]+expense.price
            }
            else{
                userTotalExpense[expense.userId] = expense.price
            }
        })
        const users = await User.findAll();
        userLeaderboard = []
        users.forEach((user)=>{
            userLeaderboard.push({name:user.name,
                total_expense:userTotalExpense[user.id]||0})
        })
        userLeaderboard.sort((a,b)=>b.total_expense-a.total_expense)
        res.json({userLeaderboard:userLeaderboard})

    }
    catch (err) {
        console.log(err)
    }
}