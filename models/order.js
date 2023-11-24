const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('order',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    payment_id:{
        type:Sequelize.STRING,
    },
    order_id:{
        type:Sequelize.STRING,
    },
    status:{
        type:Sequelize.STRING
    }
})

module.exports = Order