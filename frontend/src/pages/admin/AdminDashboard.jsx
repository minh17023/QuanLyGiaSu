import React, { useState, useEffect } from 'react';
import { getStudentFinances } from '../../services/dashboard.service';
import { exportDatabase, importDatabase } from '../../services/backup.service';
import { Wallet, DollarSign, Calendar as CalendarIcon, CheckCircle, Scale, Users, Download, Upload, AlertTriangle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [finances, setFinances] = useState([]);
  const [summary, setSummary] = useState({ totalDebt: 0, totalPaid: 0, remainingDebt: 0 });
  
  // Set default to current month's start and end date
  const today = new Date();
  const firstDayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const lastDayStr = `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;
  
  const [startDate, setStartDate] = useState(firstDayStr);
  const [endDate, setEndDate] = useState(lastDayStr);
  const [searchStudentQuery, setSearchStudentQuery] = useState('');

  useEffect(() => {
    fetchFinances(startDate, endDate);
  }, [startDate, endDate]);

  const fetchFinances = async (startDateStr, endDateStr) => {
    try {
      if (!startDateStr || !endDateStr) return;
      
      // Validations: If end date is before start date, we could skip fetching or handle it
      if (startDateStr > endDateStr) {
        setFinances([]);
        setSummary({ totalDebt: 0, totalPaid: 0, remainingDebt: 0 });
        return;
      }

      const data = await getStudentFinances(startDateStr, endDateStr);
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

  const handleExport = async () => {
    try {
      toast.loading('Đang trích xuất dữ liệu...', { id: 'backup' });
      const data = await exportDatabase();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quanlygiasu_backup_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Sao lưu dữ liệu thành công!', { id: 'backup' });
    } catch (err) {
      toast.error('Lỗi khi sao lưu dữ liệu', { id: 'backup' });
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm('CẢNH BÁO NGUY HIỂM: Hành động này sẽ XÓA SẠCH toàn bộ dữ liệu hiện tại và thay thế bằng dữ liệu từ file bạn vừa tải lên! Bạn có chắc chắn muốn tiếp tục không?')) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        toast.loading('Đang phục hồi dữ liệu, vui lòng không đóng trang...', { id: 'restore' });
        await importDatabase(jsonData);
        toast.success('Phục hồi dữ liệu thành công! Trang sẽ tải lại sau 2 giây.', { id: 'restore', duration: 3000 });
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        toast.error('Lỗi khi phục hồi dữ liệu: ' + (err.response?.data?.message || err.message), { id: 'restore' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
      
      {/* SECTION BÁO CÁO THU NHẬP THEO THÁNG */}
      <div className="bg-white/40 backdrop-blur-lg p-6 rounded-3xl shadow-sm border border-slate-200/50 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1"><Wallet className="text-emerald-600" size={24} /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Báo Cáo Thu Nhập </h1>
              <p className="text-slate-500 text-sm mt-1">Doanh thu theo tháng của gia sư</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex gap-2">
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-xl font-semibold border border-indigo-200 transition-colors"
              >
                <Download size={18} /> Backup
              </button>
              <label className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-2 rounded-xl font-semibold border border-rose-200 transition-colors cursor-pointer">
                <Upload size={18} /> Restore
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-white/50 p-3 sm:px-4 sm:py-2 rounded-xl border border-slate-200/50 mt-2 sm:mt-0 w-full sm:w-auto">
              <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Từ:</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-transparent outline-none font-bold text-slate-800"
                />
              </div>
              <span className="hidden sm:inline text-slate-400">|</span>
              <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Đến:</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-transparent outline-none font-bold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 0: Tổng học sinh */}
          <div className="p-6 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between bg-white/40 backdrop-blur-lg">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Tổng Học Sinh</p>
              <p className="text-2xl font-black text-indigo-600">{finances.length}</p>
              <p className="text-xs text-slate-400 mt-1">Trong khoảng thời gian chọn</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users size={24} />
            </div>
          </div>
          {/* Card 1: Tổng thu nhập */}
          <div className="p-6 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between bg-white/40 backdrop-blur-lg">
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
          <div className="p-6 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between bg-white/40 backdrop-blur-lg">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Đã Thu Tiền (Trong kỳ)</p>
              <p className="text-2xl font-black text-blue-600">{formatCurrency(summary.totalPaid)}</p>
              <p className="text-xs text-slate-400 mt-1">Tiền mặt / Chuyển khoản</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <ReceiptIcon size={24} />
            </div>
          </div>

          {/* Card 3: Còn nợ */}
          <div className="p-6 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between bg-white/40 backdrop-blur-lg">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Còn Nợ (Kỳ chọn)</p>
              <p className="text-2xl font-black text-orange-500">{formatCurrency(summary.remainingDebt)}</p>
              <p className="text-xs text-slate-400 mt-1">Chưa thanh toán hết</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Scale size={24} />
            </div>
          </div>
        </div>
      </div>

      {(() => {
        const filteredFinances = finances.filter(student => 
          student.full_name?.toLowerCase().includes(searchStudentQuery.toLowerCase()) || 
          student.phone?.includes(searchStudentQuery)
        );

        return (
          <div className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-sm border border-slate-200/50 overflow-x-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-800">Chi Tiết Thu Nhập Từng Học Sinh</h2>
                {startDate && endDate && (
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-sm border border-emerald-100 hidden sm:block">
                    {startDate === endDate 
                      ? `Ngày ${startDate.split('-')[2]}/${startDate.split('-')[1]}/${startDate.split('-')[0]}`
                      : `Từ ${startDate.split('-')[2]}/${startDate.split('-')[1]}/${startDate.split('-')[0]} đến ${endDate.split('-')[2]}/${endDate.split('-')[1]}/${endDate.split('-')[0]}`
                    }
                  </div>
                )}
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm học sinh, SĐT..." 
                  value={searchStudentQuery}
                  onChange={e => setSearchStudentQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-200/50 rounded-xl outline-none focus:border-blue-500/50 text-sm"
                />
              </div>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase">
                  <th className="py-3 px-2">Họ và tên</th>
                  <th className="py-3 px-2">Lớp</th>
                  <th className="py-3 px-2">Học phí / Buổi</th>
                  <th className="py-3 px-2">Buổi "Có mặt"</th>
                  <th className="py-3 px-2">Tổng tiền</th>
                  <th className="py-3 px-2">Đã đóng</th>
                  <th className="py-3 px-2">Còn nợ</th>
                </tr>
              </thead>
              <tbody>
                {filteredFinances.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-600 font-medium">
                      {finances.length === 0 
                        ? `Chưa có dữ liệu thu nhập trong khoảng thời gian này ${startDate > endDate ? '(Lưu ý: "Từ ngày" lớn hơn "Đến ngày")' : ''}` 
                        : 'Không tìm thấy học sinh phù hợp'}
                    </td>
                  </tr>
                ) : filteredFinances.map(student => (
                  <tr key={student.student_id} className="border-b border-slate-200/50 last:border-0 hover:bg-white/50 transition-colors">
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
        );
      })()}
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
