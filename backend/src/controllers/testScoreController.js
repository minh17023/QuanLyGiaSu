const { TestScore, User } = require('../models');

// Lấy điểm của một học sinh
exports.getTestScoresByStudent = async (req, res) => {
  try {
    const scores = await TestScore.findAll({
      where: { student_id: req.params.studentId },
      order: [['date', 'DESC']]
    });
    res.json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy điểm kiểm tra.' });
  }
};

// Lấy tất cả điểm (nếu admin muốn xem toàn bộ)
exports.getAllTestScores = async (req, res) => {
  try {
    const scores = await TestScore.findAll({
      include: [{ model: User, attributes: ['id', 'username', 'full_name'] }],
      order: [['date', 'DESC']]
    });
    res.json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy điểm kiểm tra.' });
  }
};

// Tạo điểm kiểm tra mới
exports.createTestScore = async (req, res) => {
  try {
    const { student_id, date, test_type, score, notes } = req.body;
    const testScore = await TestScore.create({
      student_id,
      date,
      test_type,
      score,
      notes
    });
    res.status(201).json(testScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tạo điểm kiểm tra.' });
  }
};

// Xóa điểm kiểm tra
exports.deleteTestScore = async (req, res) => {
  try {
    const testScore = await TestScore.findByPk(req.params.id);
    if (!testScore) return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra.' });

    await testScore.destroy();
    res.json({ message: 'Đã xóa bài kiểm tra thành công.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi xóa bài kiểm tra.' });
  }
};
