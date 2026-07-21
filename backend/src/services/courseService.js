const { Course } = require('../models');

const getAllCourses = async () => {
  return await Course.findAll();
};

const getCourseById = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) throw new Error('Không tìm thấy khóa học');
  return course;
};

const createCourse = async (data) => {
  return await Course.create(data);
};

const updateCourse = async (id, data) => {
  const course = await Course.findByPk(id);
  if (!course) throw new Error('Không tìm thấy khóa học');
  return await course.update(data);
};

const deleteCourse = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) throw new Error('Không tìm thấy khóa học');
  await course.destroy();
  return { message: 'Xóa khóa học thành công' };
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
