const express = require('express');
const {
  enroll,
  getMyEnrollments,
  getAllEnrollments,
  updateStatus,
  adminEnroll,
  deleteEnrollment
} = require('../controllers/enrollmentController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// Yêu cầu đăng nhập
router.use(protect);

// Dành cho học sinh
router.post('/', enroll);
router.get('/me', getMyEnrollments);

// Dành cho Gia sư (Admin)
router.get('/all', adminOnly, getAllEnrollments);
router.put('/:id/status', adminOnly, updateStatus);
router.post('/admin', adminOnly, adminEnroll);
router.delete('/:id', adminOnly, deleteEnrollment);

module.exports = router;
