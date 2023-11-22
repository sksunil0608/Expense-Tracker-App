const express = require('express');
const sequelize =require('./util/database')
const cors = require("cors");
const path = require('path')
const helment = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs = require('fs')
const bodyParser = require('body-parser')

const User = require('./models/users')
const Expense = require('./models/expenses')
const Order = require('./models/orders')
const ForgotPassword = require('./models/forgotPassword')
const DownloadLog = require('./models/downloadLog')

const app= express();
app.use(cors())

app.use(compression());
app.use(helment({ contentSecurityPolicy: false ,}));

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
)
app.use(morgan('combined',{stream:accessLogStream}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')))

const expenseRoutes = require('./routes/expenses')
const userRoutes = require('./routes/users')
const premiumRoutes = require('./routes/premium')
const premiumFeatureRoutes = require('./routes/premiumFeatures')
const passwordRoutes = require('./routes/passwordManagement')
const homeRoutes = require('./routes/home')
app.use(homeRoutes)
app.use(userRoutes);
app.use(passwordRoutes)
app.use(expenseRoutes);
app.use(premiumRoutes);
app.use(premiumFeatureRoutes)



app.use((req, res, next) => {
        return res.sendFile(path.join(__dirname, 'views', '404.html'));
    });



User.hasMany(Expense);
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User)

User.hasMany(DownloadLog)
DownloadLog.belongsTo(User);


sequelize.sync().then(()=>{
    app.listen(process.env.PORT||3000);
}).
catch(err=>console.log(err))
