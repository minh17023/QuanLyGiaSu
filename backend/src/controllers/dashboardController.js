const dashboardService = require('../services/dashboardService');

const getStudentFinances = async (req, res) => {
  try {
    const { month, year, startMonth, startYear, endMonth, endYear, startDateStr, endDateStr } = req.query;
    const finances = await dashboardService.getStudentFinances({ month, year, startMonth, startYear, endMonth, endYear, startDateStr, endDateStr });
    res.json(finances);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const addPayment = async (req, res) => {
  try {
    const { student_id, amount, note } = req.body;
    const payment = await dashboardService.addPayment(student_id, amount, note);
    res.status(201).json({ message: 'Thu tiền thành công', payment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getStudentFinances,
  addPayment
};
