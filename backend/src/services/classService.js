const { Class, Course, Enrollment, User } = require('../models');

const getAllClasses = async () => {
  return await Class.findAll({
    include: [
      { model: Course, attributes: ['name', 'price'] },
      { model: Enrollment, include: [{ model: User, attributes: ['id', 'full_name', 'username', 'phone'] }] }
    ]
  });
};

const createClass = async (data) => {
  return await Class.create(data);
};

const updateClass = async (id, data) => {
  const cls = await Class.findByPk(id);
  if (!cls) throw new Error('Không tìm thấy lớp học');
  return await cls.update(data);
};

const deleteClass = async (id) => {
  const cls = await Class.findByPk(id);
  if (!cls) throw new Error('Không tìm thấy lớp học');
  return await cls.destroy();
};

module.exports = {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass
};
