'use strict'
module.exports = function (sequelize, DataTypes) {
  const rolesUser = sequelize.define(
    'rolesUser',
    // {
    //   permission_id: {
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: DataTypes.INTEGER,
    //   },
    //   name: {
    //     type: DataTypes.STRING,
    //     allowNull : false
    //   }
    // },
  )
  rolesUser.associate=function(models){
    rolesUser.belongsTo(models.user,{ foreignKey: 'user_id' }) 
    rolesUser.belongsTo(models.role,{foreignKey:'role_id'})
  }

  return rolesUser;
}
