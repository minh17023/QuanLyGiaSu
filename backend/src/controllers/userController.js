const userService = require('../services/userService');

// 1. Đăng ký tài khoản mới
const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      message: 'Tạo tài khoản thành công',
      user
    });
  } catch (error) {
    if (error.message === 'Tên đăng nhập đã tồn tại!') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 2. Đăng nhập
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await userService.loginUser(username, password);
    res.json({
      message: 'Đăng nhập thành công',
      token: data.token,
      user: data.user
    });
  } catch (error) {
    if (error.message === 'Tên đăng nhập hoặc mật khẩu không đúng') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 3. Lấy danh sách Học sinh (Chỉ Admin mới được dùng)
const getStudents = async (req, res) => {
  try {
    const students = await userService.getStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 4. Lấy thông tin cá nhân (Profile của người đang đăng nhập)
const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  } catch (error) {
    if (error.message === 'Không tìm thấy người dùng') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const student = await userService.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await userService.updateStudent(req.params.id, req.body);
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await userService.deleteStudent(req.params.id);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login, getStudents, getProfile, createStudent, updateStudent, deleteStudent };
