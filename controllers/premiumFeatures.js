const Expense = require('../models/expenses')
const User = require('../models/users');
const sequelize = require('../util/database');

exports.getLeaderboard = async (req, res) => {
    try {
        // const userLeaderboard = await User.findAll({
        //     attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.price')), 'total_expense']],
        //     include:[
        //         {
        //             model:Expense,
        //             attributes:[]
        //         }
        //     ],
        //     group:['id'],
        //     order:[[sequelize.col('total_expense'),"DESC"]]
        // }) 
        const userLeaderboard = await User.findAll({
            attributes:['name','totalExpenseAmount'],
            order:[['totalExpenseAmount','DESC']]
            
        })

        res.status(200).json({userLeaderboard})

    }
    catch (err) {
        console.log(err)
    }
}