const attendanceService = require('../services/attendanceService');

const getSchedulesByDate = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) return res.status(400).json({ message: 'Vui lòng cung cấp tham số date' });
    
    const schedules = await attendanceService.getSchedulesByDate(date);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getAttendanceForSchedule = async (req, res) => {
  try {
    const list = await attendanceService.getAttendanceForSchedule(req.params.scheduleId);
    res.json(list);
  } catch (error) {
    if (error.message === 'Không tìm thấy lịch học') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { schedule_id, student_id, status } = req.body;
    const record = await attendanceService.markAttendance(schedule_id, student_id, status);
    res.json({ message: 'Điểm danh thành công', record });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAttendancesByStudent = async (req, res) => {
  try {
    const list = await attendanceService.getAttendancesByStudent(req.params.studentId);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  getSchedulesByDate,
  getAttendanceForSchedule,
  markAttendance,
  getAttendancesByStudent
};
