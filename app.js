const express = require('express');
const sequelize =require('./util/database')
const cors = require("cors");
const path = require('path')
const bodyParser = require('body-parser')

const app= express();
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')))

const expenseRoutes = require('./routes/expenses')
const userRoutes = require('./routes/users')
app.use(expenseRoutes);
app.use(userRoutes);

sequelize.sync().then(()=>{
    app.listen(3000);
}).
catch(err=>console.log(err))
