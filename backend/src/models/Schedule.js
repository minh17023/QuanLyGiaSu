const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Schedule = sequelize.define('Schedule', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  start_time: { type: DataTypes.DATE, allowNull: false },
  end_time: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'), defaultValue: 'scheduled' },
  lesson_notes: { type: DataTypes.TEXT, allowNull: true },
  class_id: { type: DataTypes.INTEGER, allowNull: true } // explicit FK
}, { tableName: 'schedules', timestamps: true });

module.exports = Schedule;
