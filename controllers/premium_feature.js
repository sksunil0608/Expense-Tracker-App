const Expense = require('../models/expense')
const User = require('../models/user');
const sequelize = require('../util/database');

exports.getLeaderboard = async (req, res) => {
    try {
        // const user_leaderboard = await User.findAll({
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
        const user_leaderboard = await User.findAll({
            attributes:['name','total_expense_amount'],
            order:[['total_expense_amount','DESC']]
            
        })

        res.status(200).json({user_leaderboard})

    }
    catch (err) {
        console.log(err)
    }
}