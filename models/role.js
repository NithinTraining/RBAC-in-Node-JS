'use strict'
module.exports = function (sequelize, DataTypes) {
  const role = sequelize.define(
    'role',
    {
      role_id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
  )
  role.associate = function (models) {
    role.hasMany(models.user, { foreignKey: 'role_id' });
    role.hasMany(models.permission, { foreignKey: 'role_id' });
  }
  return role;
}
