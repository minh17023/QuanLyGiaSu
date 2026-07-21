import React, { useState, useEffect } from 'react';
import { getStudentFinances } from '../../services/dashboard.service';
import { Wallet, DollarSign, Calendar as CalendarIcon, CheckCircle, Scale, Users } from 'lucide-react';

const AdminDashboard = () => {
  const [finances, setFinances] = useState([]);
  const [summary, setSummary] = useState({ totalDebt: 0, totalPaid: 0, remainingDebt: 0 });
  
  // Set default month to current month
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);

  useEffect(() => {
    fetchFinances(selectedMonth);
  }, [selectedMonth]);

  const fetchFinances = async (monthStr) => {
    try {
      if (!monthStr) return;
      const [year, month] = monthStr.split('-');
      const data = await getStudentFinances(month, year);
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

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) || '0 đ';

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
      
      {/* SECTION BÁO CÁO THU NHẬP THEO THÁNG */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-1"><Wallet className="text-emerald-600" size={24} /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Báo Cáo Thu Nhập Theo Tháng Gia Sư</h1>
              <p className="text-slate-500 text-sm mt-1">Tự động tính toán dựa trên các buổi học điểm danh "Có mặt" thành công trong tháng chọn.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <label className="text-sm font-semibold text-slate-700">Chọn Tháng:</label>
            <input 
              type="month" 
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-transparent outline-none font-bold text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 0: Tổng học sinh */}
          <div className="p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between bg-white">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Tổng Học Sinh</p>
              <p className="text-2xl font-black text-indigo-600">{finances.length}</p>
              <p className="text-xs text-slate-400 mt-1">Trong tháng này</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users size={24} />
            </div>
          </div>
          {/* Card 1: Tổng thu nhập */}
          <div className="p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between bg-white">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Tổng Thu Nhập Tạo Ra</p>
              <p className="text-2xl font-black text-emerald-600">{formatCurrency(summary.totalDebt)}</p>
              <p className="text-xs text-slate-400 mt-1">{finances.reduce((s, i) => s + i.attended_sessions, 0)} buổi dạy có mặt</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUpIcon size={24} />
            </div>
          </div>

          {/* Card 2: Đã thu tiền */}
          <div className="p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between bg-white">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Đã Thu Tiền (Trong tháng)</p>
              <p className="text-2xl font-black text-blue-600">{formatCurrency(summary.totalPaid)}</p>
              <p className="text-xs text-slate-400 mt-1">Tiền mặt / Chuyển khoản</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <ReceiptIcon size={24} />
            </div>
          </div>

          {/* Card 3: Còn nợ */}
          <div className="p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between bg-white">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Còn Nợ (Tháng chọn)</p>
              <p className="text-2xl font-black text-orange-500">{formatCurrency(summary.remainingDebt)}</p>
              <p className="text-xs text-slate-400 mt-1">Chưa thanh toán hết</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Scale size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Chi Tiết Thu Nhập Từng Học Sinh Trong Tháng</h2>
          {selectedMonth && (
            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-sm border border-emerald-100">
              Tháng {selectedMonth.split('-')[1]}/{selectedMonth.split('-')[0]}
            </div>
          )}
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase">
              <th className="py-3 px-2">Họ và tên</th>
              <th className="py-3 px-2">Lớp</th>
              <th className="py-3 px-2">Học phí / Buổi</th>
              <th className="py-3 px-2">Buổi "Có mặt"</th>
              <th className="py-3 px-2">Tổng tiền tháng</th>
              <th className="py-3 px-2">Đã đóng</th>
              <th className="py-3 px-2">Còn nợ tháng</th>
            </tr>
          </thead>
          <tbody>
            {finances.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-10 text-slate-500">Chưa có dữ liệu thu nhập trong tháng này</td></tr>
            ) : finances.map(student => (
              <tr key={student.student_id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="py-4 px-2">
                  <p className="font-bold text-slate-800">{student.full_name}</p>
                </td>
                <td className="py-4 px-2">
                  <div className="space-y-1">
                    {student.details && student.details.length > 0 ? student.details.map((d, i) => (
                      <div key={i} className="text-sm font-semibold text-slate-600 bg-slate-100 inline-block px-2 py-0.5 rounded mr-1">
                        {d.class_name}
                      </div>
                    )) : <span className="text-sm text-slate-400">-</span>}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="space-y-1">
                    {student.details && student.details.length > 0 ? student.details.map((d, i) => (
                      <div key={i} className="text-sm text-slate-600">{formatCurrency(d.price)}</div>
                    )) : <span className="text-sm text-slate-400">-</span>}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="space-y-1">
                    {student.details && student.details.length > 0 ? student.details.map((d, i) => (
                      <div key={i} className="text-sm font-bold text-blue-600">{d.attended_sessions} buổi</div>
                    )) : <span className="text-sm text-slate-400">-</span>}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <p className="font-bold text-emerald-600">{formatCurrency(student.total_debt)}</p>
                </td>
                <td className="py-4 px-2">
                  <p className="font-bold text-emerald-600">{student.total_paid > 0 ? formatCurrency(student.total_paid) : '0 đ'}</p>
                </td>
                <td className="py-4 px-2">
                  {student.remaining_debt > 0 ? (
                    <p className="font-bold text-orange-500">{formatCurrency(student.remaining_debt)}</p>
                  ) : (
                    <p className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle size={14}/> 0 VNĐ</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SVG Icons
const TrendingUpIcon = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const ReceiptIcon = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 17.5v-11"></path></svg>
);

export default AdminDashboard;
