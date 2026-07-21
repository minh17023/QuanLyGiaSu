const { User, Attendance, Schedule, Class, Course, Payment } = require('../models');
const { Op } = require('sequelize');

const getStudentFinances = async ({ month, year } = {}) => {
  let scheduleWhere = {};
  let paymentWhere = { status: 'paid' };

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    scheduleWhere.start_time = {
      [Op.between]: [startDate, endDate]
    };

    paymentWhere.payment_date = {
      [Op.between]: [startDate, endDate]
    };
  }

  const students = await User.findAll({
    where: { role: 'student' },
    include: [
      {
        model: Attendance,
        where: { status: 'present' },
        required: false,
        include: [{ 
          model: Schedule, 
          where: scheduleWhere,
          required: false,
          include: [{ model: Class, include: [{ model: Course, attributes: ['price'] }] }] 
        }]
      },
      {
        model: Payment,
        where: paymentWhere,
        required: false
      }
    ]
  });

  const finances = students.map(student => {
    let total_debt = 0;
    let attended_sessions = 0;
    const classes_info = new Map();

    if (student.Attendances) {
      student.Attendances.forEach(att => {
        if (!att.Schedule) return; // Nếu Schedule không khớp ngày tháng, model Sequelize có thể trả về null (vì required: false ở Attendance nhưng ta muốn filter)
        
        const className = att.Schedule?.Class?.name || 'Không rõ';
        const price = att.Schedule?.Class?.Course?.price || 0;
        total_debt += Number(price);
        attended_sessions++;

        if (!classes_info.has(className)) {
          classes_info.set(className, { price: Number(price), sessions: 0, total: 0 });
        }
        const info = classes_info.get(className);
        info.sessions += 1;
        info.total += Number(price);
      });
    }

    let total_paid = 0;
    if (student.Payments) {
      student.Payments.forEach(pay => {
        total_paid += Number(pay.amount);
      });
    }

    const remaining_debt = total_debt - total_paid;

    // Build details for frontend table
    const details = Array.from(classes_info.entries()).map(([cName, info]) => ({
      class_name: cName,
      price: info.price,
      attended_sessions: info.sessions,
      total_money: info.total
    }));

    return {
      student_id: student.id,
      full_name: student.full_name || student.username,
      phone: student.phone,
      attended_sessions,
      total_debt,
      total_paid,
      remaining_debt,
      details
    };
  });

  // Lọc ra các học sinh CÓ THU NHẬP hoặc CÓ ĐÓNG TIỀN trong tháng (hoặc học sinh chưa thanh toán hết nợ)
  return finances.filter(f => f.total_debt > 0 || f.total_paid > 0 || f.remaining_debt > 0);
};

const addPayment = async (student_id, amount, note) => {
  return await Payment.create({
    student_id,
    amount,
    status: 'paid',
    note,
    payment_date: new Date()
  });
};

module.exports = {
  getStudentFinances,
  addPayment
};
