const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { type: DataTypes.ENUM('scheduled', 'present', 'absent', 'excused'), defaultValue: 'scheduled' }
}, { tableName: 'attendances', timestamps: true });

module.exports = Attendance;
