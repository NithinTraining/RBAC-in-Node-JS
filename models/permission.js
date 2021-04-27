'use strict'
module.exports = function (sequelize, DataTypes) {
  const permission = sequelize.define(
    'permission',
    {
      permission_id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull : false
      }
    },
  )
  return permission;
}
