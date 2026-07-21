const { Schedule, Course, Class, Enrollment, Attendance } = require('../models');

const getAllSchedules = async () => {
  return await Schedule.findAll({
    include: [{ model: Class, include: [{ model: Course, attributes: ['name', 'price'] }] }]
  });
};

const getScheduleById = async (id) => {
  const schedule = await Schedule.findByPk(id, {
    include: [{ model: Class, include: [{ model: Course, attributes: ['name', 'price'] }] }]
  });
  if (!schedule) throw new Error('Không tìm thấy lịch học');
  return schedule;
};

const createSchedule = async (data) => {
  const { student_ids, ...scheduleData } = data;
  const schedule = await Schedule.create(scheduleData);
  
  let studentsToSchedule = [];
  
  if (student_ids && student_ids.length > 0) {
    // Lịch cho học sinh lẻ
    studentsToSchedule = student_ids;
  } else if (scheduleData.class_id) {
    // Lịch cho cả lớp
    const enrollments = await Enrollment.findAll({
      where: { class_id: scheduleData.class_id, status: ['active', 'completed'] }
    });
    studentsToSchedule = enrollments.map(e => e.student_id);
  }

  // Tạo các bản ghi điểm danh với trạng thái 'scheduled'
  if (studentsToSchedule.length > 0) {
    const attendanceRecords = studentsToSchedule.map(sId => ({
      schedule_id: schedule.id,
      student_id: sId,
      status: 'scheduled'
    }));
    await Attendance.bulkCreate(attendanceRecords);
  }

  return schedule;
};

const updateSchedule = async (id, data) => {
  const schedule = await Schedule.findByPk(id);
  if (!schedule) throw new Error('Không tìm thấy lịch học');
  return await schedule.update(data);
};

const deleteSchedule = async (id) => {
  const schedule = await Schedule.findByPk(id);
  if (!schedule) throw new Error('Không tìm thấy lịch học');
  await schedule.destroy();
  return { message: 'Xóa lịch học thành công' };
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
