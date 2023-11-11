const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const Expense = sequelize.define('expenses',{ 
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    expenseName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    price:{
        type:Sequelize.DOUBLE,
        allowNull: false,
        default: 0,
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false,
    }
})

module.exports = Expense;