const { User, TestScore } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validateEmail = (email) => {
  if (!email || email.trim() === '') return true;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') return true;
  const re = /^0\d{9}$/;
  return re.test(phone);
};

const registerUser = async (userData) => {
  const { username, password, full_name, email, phone, role } = userData;
  
  const userExists = await User.findOne({ where: { username } });
  if (userExists) {
    throw new Error('Tên đăng nhập đã tồn tại!');
  }

  if (email && !validateEmail(email)) throw new Error('Định dạng email không hợp lệ!');
  if (phone && !validatePhone(phone)) throw new Error('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0!');

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  
  // Chỉ Admin mới có thể tự set role='admin', nếu không mặc định là 'student'
  const userRole = role === 'admin' ? 'admin' : 'student';

  const user = await User.create({
    username,
    password_hash,
    full_name,
    email,
    phone,
    role: userRole
  });

  return { id: user.id, username: user.username, full_name: user.full_name, role: user.role };
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    token,
    user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role, email: user.email }
  };
};

const getStudents = async () => {
  return await User.findAll({
    where: { role: 'student' },
    attributes: { exclude: ['password_hash'] },
    include: [{
      model: TestScore,
      attributes: ['score', 'date', 'test_type'],
      order: [['date', 'DESC']]
    }],
    order: [
      ['createdAt', 'DESC']
    ]
  });
};

const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password_hash'] }
  });
  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }
  return user;
};

const createStudent = async (data) => {
  const { username, password, full_name, email, phone } = data;
  const userExists = await User.findOne({ where: { username } });
  if (userExists) throw new Error('Tên đăng nhập đã tồn tại!');

  if (email && !validateEmail(email)) throw new Error('Định dạng email không hợp lệ!');
  if (phone && !validatePhone(phone)) throw new Error('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0!');

  if (email) {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) throw new Error('Email này đã được sử dụng!');
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password || '123456', salt); // Pass mặc định nếu không nhập

  const userEmail = email && email.trim() !== '' ? email : null;

  const user = await User.create({
    username, password_hash, full_name, email: userEmail, phone, role: 'student'
  });
  return user;
};

const updateStudent = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Không tìm thấy học sinh');

  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password_hash = await bcrypt.hash(data.password, salt);
  }
  
  if (data.email !== undefined) {
    if (data.email && !validateEmail(data.email)) throw new Error('Định dạng email không hợp lệ!');
    data.email = data.email && data.email.trim() !== '' ? data.email : null;
  }
  
  if (data.phone !== undefined) {
    if (data.phone && !validatePhone(data.phone)) throw new Error('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0!');
  }
  
  return await user.update(data);
};

const deleteStudent = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Không tìm thấy học sinh');
  return await user.destroy();
};

module.exports = {
  registerUser,
  loginUser,
  getStudents,
  getUserProfile,
  createStudent,
  updateStudent,
  deleteStudent
};
