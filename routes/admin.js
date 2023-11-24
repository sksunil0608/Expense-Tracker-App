const expenseController = require('../controllers/admin.js');
const UserAuth = require('../middleware/auth.js')
const express = require('express');

const router = express.Router();

router.get('/admin/dashboard',expenseController.getadminDashboardView)

router.get('/admin/all-expenses',UserAuth.authenticate, expenseController.getExpenses);

router.get('/admin/download',UserAuth.authenticate,expenseController.getDownloadReport);

router.get('/admin/download-history',UserAuth.authenticate,expenseController.getAllDownloadHistory)


router.get('/admin/expense/:expenseId',UserAuth.authenticate,expenseController.getExpense)

router.get('/admin/expense-report',UserAuth.authenticate,expenseController.getExpenseReportView)


// Other Request 
router.post("/admin/add-expense", UserAuth.authenticate, expenseController.postAddExpense);

router.delete("/admin/delete/:expenseId", UserAuth.authenticate,expenseController.postdeleteExpenses);

router.put('/admin/edit/:expenseId', UserAuth.authenticate, expenseController.postEditExpense)



module.exports = router;