const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const Expense = sequelize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    expense_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expense_price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
    },
    expense_category: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports = Expense;