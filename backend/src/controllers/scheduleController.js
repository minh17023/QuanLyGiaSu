const scheduleService = require('../services/scheduleService');

const getAllSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.getAllSchedules();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getScheduleById = async (req, res) => {
  try {
    const schedule = await scheduleService.getScheduleById(req.params.id);
    res.json(schedule);
  } catch (error) {
    if (error.message === 'Không tìm thấy lịch học') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const createSchedule = async (req, res) => {
  try {
    const schedule = await scheduleService.createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
    res.json(schedule);
  } catch (error) {
    if (error.message === 'Không tìm thấy lịch học') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const result = await scheduleService.deleteSchedule(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Không tìm thấy lịch học') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
