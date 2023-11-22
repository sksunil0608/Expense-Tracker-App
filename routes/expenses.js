const expenseController = require('../controllers/expenses');
const UserAuth = require('../middleware/auth')
const express = require('express');

const router = express.Router();
router.get('/admin',expenseController.viewAdminPage)

router.get('/all-expenses', UserAuth.authenticate,expenseController.getExpenses);

router.get('/user/download', UserAuth.authenticate, expenseController.downloadReport);

router.get('/user/download-history',UserAuth.authenticate,expenseController.getAllDownloadHistory)


router.get('/expense/:expenseId', UserAuth.authenticate,expenseController.getExpense)

router.get('/user/expense-report',UserAuth.authenticate,expenseController.getExpenseReportView)


// Other Request 
router.post("/add-expense", UserAuth.authenticate, expenseController.postAddExpense);

router.delete("/delete/:expenseId", UserAuth.authenticate,expenseController.deleteExpenses);

router.put('/edit/:expenseId', UserAuth.authenticate, expenseController.postEditExpense)



module.exports = router;