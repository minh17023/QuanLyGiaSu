const courseService = require('../services/courseService');

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.json(course);
  } catch (error) {
    if (error.message === 'Không tìm thấy khóa học') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    res.json(course);
  } catch (error) {
    if (error.message === 'Không tìm thấy khóa học') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const result = await courseService.deleteCourse(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Không tìm thấy khóa học') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
