const expenseController = require('../controllers/expenses');
const express = require('express');

const router = express.Router();

router.get('/all-expenses',expenseController.getExpenses);

router.get('/expense/:expenseId',expenseController.getExpense)

router.post("/add-expense", expenseController.postAddExpense);

router.delete("/delete/:expenseId",expenseController.deleteExpenses);

router.put('/edit/:expenseId',expenseController.postEditExpense)

module.exports = router;