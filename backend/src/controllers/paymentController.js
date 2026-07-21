const { Payment, User } = require('../models');

// Lấy tất cả lịch sử đóng học phí của học sinh
exports.getPaymentsByStudent = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { student_id: req.params.studentId },
      order: [['payment_date', 'DESC']]
    });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy lịch sử học phí.' });
  }
};

// Tạo giao dịch đóng học phí mới
exports.createPayment = async (req, res) => {
  try {
    const { student_id, amount, payment_date, note } = req.body;
    const payment = await Payment.create({
      student_id,
      amount,
      payment_date: payment_date || new Date(),
      note,
      status: 'paid'
    });
    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tạo giao dịch.' });
  }
};

// Cập nhật giao dịch
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Không tìm thấy giao dịch.' });

    await payment.update(req.body);
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật giao dịch.' });
  }
};

// Xóa giao dịch
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Không tìm thấy giao dịch.' });

    await payment.destroy();
    res.json({ message: 'Đã xóa giao dịch thành công.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi xóa giao dịch.' });
  }
};
