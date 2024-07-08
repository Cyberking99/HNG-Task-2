const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Organisation = sequelize.define('Organisation', {
  orgId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    defaultValue: uuidv4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
});

module.exports = Organisation;