const { sequelize, User, Course, Class, Enrollment, Schedule, Attendance, Payment, Material, TestScore } = require('../models');

exports.exportData = async (req, res) => {
  try {
    const data = {
      users: await User.findAll(),
      courses: await Course.findAll(),
      classes: await Class.findAll(),
      enrollments: await Enrollment.findAll(),
      schedules: await Schedule.findAll(),
      attendances: await Attendance.findAll(),
      payments: await Payment.findAll(),
      materials: await Material.findAll(),
      test_scores: await TestScore.findAll()
    };
    res.json(data);
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ message: 'Lỗi khi sao lưu dữ liệu' });
  }
};

exports.importData = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const data = req.body;
    
    // Postgres specific: TRUNCATE all tables and cascade, restart identity
    await sequelize.query(
      'TRUNCATE TABLE "attendances", "schedules", "enrollments", "payments", "test_scores", "materials", "classes", "courses", "users" RESTART IDENTITY CASCADE;',
      { transaction }
    );

    // Insert in forward dependency order
    if (data.users && data.users.length > 0) await User.bulkCreate(data.users, { transaction });
    if (data.courses && data.courses.length > 0) await Course.bulkCreate(data.courses, { transaction });
    if (data.classes && data.classes.length > 0) await Class.bulkCreate(data.classes, { transaction });
    if (data.materials && data.materials.length > 0) await Material.bulkCreate(data.materials, { transaction });
    if (data.test_scores && data.test_scores.length > 0) await TestScore.bulkCreate(data.test_scores, { transaction });
    if (data.payments && data.payments.length > 0) await Payment.bulkCreate(data.payments, { transaction });
    if (data.enrollments && data.enrollments.length > 0) await Enrollment.bulkCreate(data.enrollments, { transaction });
    if (data.schedules && data.schedules.length > 0) await Schedule.bulkCreate(data.schedules, { transaction });
    if (data.attendances && data.attendances.length > 0) await Attendance.bulkCreate(data.attendances, { transaction });

    // Update sequences for auto-increment in Postgres
    const tables = ['users', 'courses', 'classes', 'materials', 'test_scores', 'payments', 'enrollments', 'schedules', 'attendances'];
    for (const table of tables) {
      try {
        await sequelize.query(
          `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id)+1 FROM "${table}"), 1), false);`, 
          { transaction }
        );
      } catch(e) {}
    }

    await transaction.commit();
    res.json({ message: 'Phục hồi dữ liệu thành công' });
  } catch (error) {
    await transaction.rollback();
    console.error('Restore error:', error);
    res.status(500).json({ message: 'Lỗi khi phục hồi dữ liệu: ' + error.message });
  }
};
