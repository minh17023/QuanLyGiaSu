const express = require('express');
const router = express.Router();
const { register, login, getStudents, getProfile, createStudent, updateStudent, deleteStudent } = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Các API không cần đăng nhập (Public)
router.post('/register', register);
router.post('/login', login);

// Các API cần đăng nhập (Protected)
router.get('/profile', protect, getProfile);

// Các API chỉ dành cho Gia sư (Admin)
router.get('/students', protect, adminOnly, getStudents);
router.post('/students', protect, adminOnly, createStudent);
router.put('/students/:id', protect, adminOnly, updateStudent);
router.delete('/students/:id', protect, adminOnly, deleteStudent);

module.exports = router;
