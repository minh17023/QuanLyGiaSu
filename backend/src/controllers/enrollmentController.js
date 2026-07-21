const enrollmentService = require('../services/enrollmentService');

const enroll = async (req, res) => {
  try {
    const { class_id } = req.body;
    const student_id = req.user.id; // Từ authMiddleware protect
    const enrollment = await enrollmentService.enrollStudent(student_id, class_id);
    res.status(201).json({ message: 'Đăng ký thành công, vui lòng chờ Gia sư duyệt.', enrollment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const student_id = req.user.id;
    const enrollments = await enrollmentService.getMyEnrollments(student_id);
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getAllEnrollments();
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enrollment = await enrollmentService.updateEnrollmentStatus(req.params.id, status);
    res.json({ message: 'Cập nhật trạng thái thành công', enrollment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const adminEnroll = async (req, res) => {
  try {
    const { student_id, class_id } = req.body;
    const enrollment = await enrollmentService.enrollStudent(student_id, class_id, 'active');
    res.status(201).json({ message: 'Thêm học sinh thành công', enrollment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    await enrollmentService.deleteEnrollment(req.params.id);
    res.json({ message: 'Đã xóa học sinh khỏi lớp' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getStudentEnrollments = async (req, res) => {
  try {
    const student_id = req.params.studentId;
    const enrollments = await enrollmentService.getMyEnrollments(student_id);
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  enroll,
  getMyEnrollments,
  getAllEnrollments,
  updateStatus,
  adminEnroll,
  deleteEnrollment,
  getStudentEnrollments
};
