const { User, Attendance, Schedule, Class, Course, Payment } = require('../models');

const getStudentFinances = async () => {
  const students = await User.findAll({
    where: { role: 'student' },
    include: [
      {
        model: Attendance,
        where: { status: 'present' }, // Chỉ tính tiền những ca CÓ MẶT
        required: false,
        include: [{ model: Schedule, include: [{ model: Class, include: [{ model: Course, attributes: ['price'] }] }] }]
      },
      {
        model: Payment,
        where: { status: 'paid' },
        required: false
      }
    ]
  });

  const finances = students.map(student => {
    // Tính tổng tiền cần nộp (Dựa trên số ca có mặt * Giá 1 ca của Khóa đó)
    let total_debt = 0;
    let attended_sessions = 0;

    if (student.Attendances) {
      student.Attendances.forEach(att => {
        const price = att.Schedule?.Class?.Course?.price || 0;
        total_debt += Number(price);
        attended_sessions++;
      });
    }

    // Tính tổng tiền đã nộp
    let total_paid = 0;
    if (student.Payments) {
      student.Payments.forEach(pay => {
        total_paid += Number(pay.amount);
      });
    }

    const remaining_debt = total_debt - total_paid;

    return {
      student_id: student.id,
      full_name: student.full_name || student.username,
      phone: student.phone,
      attended_sessions,
      total_debt,
      total_paid,
      remaining_debt
    };
  });

  return finances;
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
