const sequelize = require('../config/db');

// Import models
const User = require('./User');
const Course = require('./Course');
const Class = require('./Class');
const Enrollment = require('./Enrollment');
const Schedule = require('./Schedule');
const Attendance = require('./Attendance');
const Payment = require('./Payment');
const Material = require('./Material');
const TestScore = require('./TestScore');

// Mối quan hệ (Associations)

// Course - Class (1 Môn học có nhiều Lớp học)
Course.hasMany(Class, { foreignKey: 'course_id' });
Class.belongsTo(Course, { foreignKey: 'course_id' });

// User - Enrollment - Class (Nhiều-Nhiều thông qua Enrollment)
User.hasMany(Enrollment, { foreignKey: 'student_id' });
Enrollment.belongsTo(User, { foreignKey: 'student_id' });

Class.hasMany(Enrollment, { foreignKey: 'class_id' });
Enrollment.belongsTo(Class, { foreignKey: 'class_id' });

// Class - Schedules (1 Lớp có nhiều Buổi học)
Class.hasMany(Schedule, { foreignKey: 'class_id' });
Schedule.belongsTo(Class, { foreignKey: 'class_id' });

// Schedule - Attendances (1 Buổi học có nhiều điểm danh)
Schedule.hasMany(Attendance, { foreignKey: 'schedule_id' });
Attendance.belongsTo(Schedule, { foreignKey: 'schedule_id' });

// User - Attendances (1 Học sinh có nhiều lần điểm danh)
User.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(User, { foreignKey: 'student_id' });

// User - Payments (1 Học sinh có nhiều giao dịch)
User.hasMany(Payment, { foreignKey: 'student_id' });
Payment.belongsTo(User, { foreignKey: 'student_id' });

// Lược bỏ Payment với Course, sẽ tính qua Class/Course nếu cần

// User - TestScore (1 Học sinh có nhiều điểm kiểm tra)
User.hasMany(TestScore, { foreignKey: 'student_id' });
TestScore.belongsTo(User, { foreignKey: 'student_id' });

// Course - Materials (1 Khóa học có nhiều tài liệu)
Course.hasMany(Material, { foreignKey: 'course_id' });
Material.belongsTo(Course, { foreignKey: 'course_id' });

// Hàm đồng bộ
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Không dùng force: true để tránh mất dữ liệu
    console.log('✅ Database đã được đồng bộ thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi đồng bộ database:', error);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Course,
  Class,
  Enrollment,
  Schedule,
  Attendance,
  Payment,
  Material,
  TestScore
};
