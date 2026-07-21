const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Bật thành console.log nếu muốn xem câu lệnh SQL được sinh ra
});

module.exports = sequelize;
