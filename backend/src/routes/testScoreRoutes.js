const express = require('express');
const router = express.Router();
const testScoreController = require('../controllers/testScoreController');

// Lấy điểm của 1 học sinh
router.get('/student/:studentId', testScoreController.getTestScoresByStudent);

// Lấy toàn bộ điểm
router.get('/', testScoreController.getAllTestScores);

// Thêm điểm
router.post('/', testScoreController.createTestScore);

// Xóa điểm
router.delete('/:id', testScoreController.deleteTestScore);

module.exports = router;
