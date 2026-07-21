const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TestScore = sequelize.define('TestScore', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  test_type: { type: DataTypes.STRING, allowNull: false },
  score: { type: DataTypes.DECIMAL(4, 2), allowNull: false },
  notes: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'test_scores', timestamps: true });

module.exports = TestScore;
