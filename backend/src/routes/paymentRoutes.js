const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Lấy lịch sử học phí của 1 học sinh
router.get('/student/:studentId', paymentController.getPaymentsByStudent);

// Nạp tiền/Thêm giao dịch
router.post('/', paymentController.createPayment);

// Cập nhật giao dịch
router.put('/:id', paymentController.updatePayment);

// Xóa giao dịch
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
