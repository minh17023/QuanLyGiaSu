const express = require('express');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tất cả đều yêu cầu đăng nhập
router.use(protect);

router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Các thao tác này yêu cầu quyền Admin
router.post('/', adminOnly, createCourse);
router.put('/:id', adminOnly, updateCourse);
router.delete('/:id', adminOnly, deleteCourse);

module.exports = router;
