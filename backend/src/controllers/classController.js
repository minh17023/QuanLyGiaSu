const classService = require('../services/classService');

const getAllClasses = async (req, res) => {
  try {
    const classes = await classService.getAllClasses();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    const cls = await classService.createClass(req.body);
    res.status(201).json(cls);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const cls = await classService.updateClass(req.params.id, req.body);
    res.json(cls);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    await classService.deleteClass(req.params.id);
    res.json({ message: 'Đã xóa lớp học' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass
};
