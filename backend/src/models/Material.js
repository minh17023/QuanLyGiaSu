const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Material = sequelize.define('Material', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  file_url: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'materials', timestamps: true });

module.exports = Material;
