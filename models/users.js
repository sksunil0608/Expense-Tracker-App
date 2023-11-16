const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('users',{
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
    isPremiumUser:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: false,
    },
    totalExpenses:{
        type:Sequelize.INTEGER
    }
})

module.exports = User