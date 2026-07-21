const { Attendance, Schedule, Course, Class, Enrollment, User } = require('../models');
const { Op } = require('sequelize');

const getSchedulesByDate = async (dateStr) => {
  // dateStr format: YYYY-MM-DD
  const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
  const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

  return await Schedule.findAll({
    where: {
      start_time: {
        [Op.between]: [startOfDay, endOfDay]
      }
    },
    include: [{ model: Class, include: [{ model: Course, attributes: ['name', 'price'] }] }],
    order: [['start_time', 'ASC']]
  });
};

const getAttendanceForSchedule = async (schedule_id) => {
  const schedule = await Schedule.findByPk(schedule_id);
  if (!schedule) throw new Error('Không tìm thấy lịch học');

  // Lấy các bản ghi điểm danh đã có cho ca học này (đã được tạo lúc xếp lịch)
  const attendances = await Attendance.findAll({
    where: { schedule_id },
    include: [{ model: User, attributes: ['id', 'full_name', 'username', 'phone'] }]
  });

  const attendanceList = attendances.map(record => {
    const student = record.User;
    return {
      student_id: student.id,
      full_name: student.full_name || student.username,
      phone: student.phone,
      attendance_status: record.status, // 'scheduled', 'present', 'absent', 'excused'
      attendance_id: record.id
    };
  });

  return attendanceList;
};

const markAttendance = async (schedule_id, student_id, status) => {
  const existing = await Attendance.findOne({
    where: { schedule_id, student_id }
  });

  let record;
  if (existing) {
    record = await existing.update({ status });
  } else {
    record = await Attendance.create({
      schedule_id,
      student_id,
      status
    });
  }

  // Tự động chuyển màu (trạng thái) ca học thành completed nếu có điểm danh "có mặt"
  if (status === 'present') {
    await Schedule.update({ status: 'completed' }, { where: { id: schedule_id } });
  }

  return record;
};

const getAttendancesByStudent = async (student_id) => {
  return await Attendance.findAll({
    where: { student_id },
    include: [{
      model: Schedule,
      include: [{ model: Class, include: [{ model: Course, attributes: ['name', 'price'] }] }]
    }],
    order: [[Schedule, 'start_time', 'DESC']]
  });
};

module.exports = {
  getSchedulesByDate,
  getAttendanceForSchedule,
  markAttendance,
  getAttendancesByStudent
};
