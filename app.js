const express = require('express');
const sequelize =require('./util/database')
const cors = require("cors");
const path = require('path')
const bodyParser = require('body-parser')
const User = require('./models/users')
const Expense = require('./models/expenses')
const Order = require('./models/orders')

const app= express();
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')))

const expenseRoutes = require('./routes/expenses')
const userRoutes = require('./routes/users')
const premiumRoutes = require('./routes/premium')
const premiumFeatureRoutes = require('./routes/premiumFeatures')
app.use(expenseRoutes);
app.use(userRoutes);
app.use(premiumRoutes);
app.use(premiumFeatureRoutes)


User.hasMany(Expense);
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)
sequelize.sync().then(()=>{
    app.listen(3000);
}).
catch(err=>console.log(err))
