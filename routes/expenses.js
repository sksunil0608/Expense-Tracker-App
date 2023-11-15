const expenseController = require('../controllers/expenses');
const UserAuth = require('../middleware/auth')
const express = require('express');

const router = express.Router();

router.get('/all-expenses',UserAuth.authenticate,expenseController.getExpenses);

router.get('/expense/:expenseId', UserAuth.authenticate,expenseController.getExpense)

router.post("/add-expense", UserAuth.authenticate, expenseController.postAddExpense);

router.delete("/delete/:expenseId", UserAuth.authenticate,expenseController.deleteExpenses);

router.put('/edit/:expenseId', UserAuth.authenticate, expenseController.postEditExpense)

module.exports = router;