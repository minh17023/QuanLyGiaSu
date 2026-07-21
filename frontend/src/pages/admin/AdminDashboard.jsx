import React, { useState, useEffect } from 'react';
import { getStudentFinances, addPayment } from '../../services/dashboard.service';
import { Wallet, TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [finances, setFinances] = useState([]);
  const [summary, setSummary] = useState({ totalDebt: 0, totalPaid: 0, remainingDebt: 0 });

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    try {
      const data = await getStudentFinances();
      setFinances(data);
      
      let tDebt = 0, tPaid = 0, rDebt = 0;
      data.forEach(item => {
        tDebt += item.total_debt;
        tPaid += item.total_paid;
        rDebt += item.remaining_debt;
      });
      setSummary({ totalDebt: tDebt, totalPaid: tPaid, remainingDebt: rDebt });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePay = async (student) => {
    if (student.remaining_debt <= 0) return alert('Học sinh này không còn nợ!');
    
    const amountStr = prompt(`Nhập số tiền thu từ ${student.full_name}:`, student.remaining_debt);
    if (amountStr) {
      const amount = Number(amountStr);
      if (isNaN(amount) || amount <= 0) return alert('Số tiền không hợp lệ');
      
      try {
        await addPayment(student.student_id, amount, 'Thu học phí');
        alert('Thu tiền thành công!');
        fetchFinances();
      } catch (err) {
        alert('Lỗi thu tiền');
      }
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
          <Wallet className="text-blue-600" size={36} /> Tổng Quan Tài Chính
        </h1>
        <p className="text-slate-500 mt-2">Theo dõi học phí dựa trên số ca đi học thực tế của học sinh (Chỉ tính tiền những ca có mặt)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Tổng doanh thu dự kiến</p>
            <p className="text-2xl font-black text-slate-800">{formatCurrency(summary.totalDebt)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Đã thu thực tế</p>
            <p className="text-2xl font-black text-slate-800">{formatCurrency(summary.totalPaid)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
            <DollarSign size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Còn nợ đọng</p>
            <p className="text-2xl font-black text-red-600">{formatCurrency(summary.remainingDebt)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <Users className="text-slate-500" />
          <h2 className="text-lg font-bold text-slate-800">Chi tiết Công nợ Học sinh</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-6 text-slate-600 font-bold text-sm uppercase tracking-wider">Học sinh</th>
              <th className="py-4 px-6 text-slate-600 font-bold text-sm uppercase tracking-wider text-center">Số ca đã học</th>
              <th className="py-4 px-6 text-slate-600 font-bold text-sm uppercase tracking-wider text-right">Tổng phải nộp</th>
              <th className="py-4 px-6 text-slate-600 font-bold text-sm uppercase tracking-wider text-right">Đã nộp</th>
              <th className="py-4 px-6 text-slate-600 font-bold text-sm uppercase tracking-wider text-right">Còn nợ</th>
              <th className="py-4 px-6 text-slate-600 font-bold text-sm uppercase tracking-wider text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {finances.map(item => (
              <tr key={item.student_id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-800">{item.full_name}</p>
                  <p className="text-xs text-slate-500">{item.phone || 'Không SĐT'}</p>
                </td>
                <td className="py-4 px-6 text-center font-bold text-indigo-600">{item.attended_sessions}</td>
                <td className="py-4 px-6 text-right font-semibold text-slate-700">{formatCurrency(item.total_debt)}</td>
                <td className="py-4 px-6 text-right font-semibold text-green-600">{formatCurrency(item.total_paid)}</td>
                <td className="py-4 px-6 text-right font-bold text-red-600">{formatCurrency(item.remaining_debt)}</td>
                <td className="py-4 px-6 text-center">
                  {item.remaining_debt > 0 ? (
                    <button 
                      onClick={() => handlePay(item)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition"
                    >
                      Thu tiền
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Đã thanh toán đủ</span>
                  )}
                </td>
              </tr>
            ))}
            {finances.length === 0 && (
              <tr><td colSpan="6" className="text-center py-10 text-slate-500">Chưa có dữ liệu học sinh/điểm danh</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
