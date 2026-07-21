const { Enrollment, User, Class, Course } = require('../models');

// Học sinh đăng ký lớp học
const enrollStudent = async (student_id, class_id, status = 'pending') => {
  // Kiểm tra xem đã đăng ký chưa
  const existing = await Enrollment.findOne({
    where: { student_id, class_id }
  });
  if (existing) {
    throw new Error('Học sinh đã được đăng ký vào lớp học này rồi!');
  }

  return await Enrollment.create({
    student_id,
    class_id,
    status
  });
};

// Lấy danh sách khóa học của 1 học sinh
const getMyEnrollments = async (student_id) => {
  return await Enrollment.findAll({
    where: { student_id },
    include: [{ model: Class, include: [{ model: Course, attributes: ['name', 'price'] }] }]
  });
};

// Gia sư lấy danh sách tất cả học sinh đăng ký (tất cả khóa)
const getAllEnrollments = async () => {
  return await Enrollment.findAll({
    include: [
      { model: User, attributes: ['username', 'full_name', 'phone'] },
      { model: Class, include: [{ model: Course, attributes: ['name'] }] }
    ],
    order: [['createdAt', 'DESC']]
  });
};

// Gia sư duyệt hoặc hủy trạng thái
const updateEnrollmentStatus = async (id, status) => {
  const enrollment = await Enrollment.findByPk(id);
  if (!enrollment) {
    throw new Error('Không tìm thấy bản ghi đăng ký');
  }
  return await enrollment.update({ status });
};

const deleteEnrollment = async (id) => {
  const enrollment = await Enrollment.findByPk(id);
  if (!enrollment) {
    throw new Error('Không tìm thấy bản đăng ký này');
  }
  return await enrollment.destroy();
};

module.exports = {
  enrollStudent,
  getMyEnrollments,
  getAllEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment
};
