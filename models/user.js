const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        unique:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    is_premium_user:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: false,
    },
    total_expense_amount:{
        type:Sequelize.INTEGER
    },
    total_expenses: {
        type: Sequelize.INTEGER
    }
})

module.exports = User