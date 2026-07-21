const express = require('express');
const {
  getSchedulesByDate,
  getAttendanceForSchedule,
  markAttendance
} = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly); // Chỉ Admin mới được quản lý điểm danh

router.get('/schedules', getSchedulesByDate); // ?date=2024-10-15
router.get('/:scheduleId', getAttendanceForSchedule);
router.post('/mark', markAttendance);

module.exports = router;
