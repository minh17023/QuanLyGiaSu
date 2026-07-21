const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { syncDatabase, sequelize } = require('./models');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Phân tích JSON body lớn (cho backup)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import Routes
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const classRoutes = require('./routes/classRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const testScoreRoutes = require('./routes/testScoreRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const backupRoutes = require('./routes/backupRoutes');

// Basic route test
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Tutor Management API' });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/test-scores', testScoreRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/backup', backupRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
  
  try {
    // Kiểm tra kết nối DB
    await sequelize.authenticate();
    console.log('✅ Kết nối Database thành công.');
    
    // Tự động tạo/đồng bộ bảng từ Models
    await syncDatabase();
  } catch (error) {
    console.error('❌ Không thể kết nối tới database:', error);
  }
});
