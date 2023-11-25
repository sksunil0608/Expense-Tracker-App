const express = require('express');
const sequelize =require('./util/database')
const cors = require("cors");
const path = require('path')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs = require('fs')
const bodyParser = require('body-parser')

const User = require('./models/user')
const Expense = require('./models/expense')
const Order = require('./models/order')
const Forgotpassword = require('./models/forgot_password')
const Downloadlog = require('./models/download_log')

const app= express();

app.use(cors())

// app.use(compression());
// app.use(helmet({ contentSecurityPolicy: false ,}));

// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname,'access.log'),
//     {flags:'a'}
// )
// app.use(morgan('combined',{stream:accessLogStream}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')))

const adminRoutes = require('./routes/admin')
const userRoutes = require('./routes/user')
const premiumRoutes = require('./routes/premium')
const premiumFeatureRoutes = require('./routes/premium_feature')
const passwordRoutes = require('./routes/password_management')
const homeRoutes = require('./routes/home')
app.use(homeRoutes)
app.use(userRoutes);
app.use(passwordRoutes)
app.use(adminRoutes);
app.use(premiumRoutes);
app.use(premiumFeatureRoutes)



app.use((req, res, next) => {
        return res.sendFile(path.join(__dirname, 'views', '404.html'));
    });



User.hasMany(Expense);
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User)

User.hasMany(Downloadlog)
Downloadlog.belongsTo(User);


sequelize.sync().then(()=>{
    app.listen(process.env.PORT||3000);
}).
catch(err=>console.log(err))
