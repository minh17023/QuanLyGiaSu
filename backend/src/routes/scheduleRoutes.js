const express = require('express');
const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getAllSchedules);
router.get('/:id', getScheduleById);

router.post('/', adminOnly, createSchedule);
router.put('/:id', adminOnly, updateSchedule);
router.delete('/:id', adminOnly, deleteSchedule);

module.exports = router;
