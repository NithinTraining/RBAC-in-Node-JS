const db = require("../models");

const _ = require("lodash");

module.exports.toPlain = (response) => {
  if (!response) return null;
  const flattenDataValues = ({ dataValues }) =>
    _.mapValues(dataValues, (value) =>
      _.isArray(value) &&
      _.isObject(value[0]) &&
      _.isObject(value[0].dataValues)
        ? _.map(value, flattenDataValues)
        : _.isObject(value) && _.isObject(value.dataValues)
        ? flattenDataValues(value)
        : value
    );

  return _.isArray(response)
    ? _.map(response, flattenDataValues)
    : flattenDataValues(response);
};

module.exports.checkPermission = async ({ userId, permission }) => {
  const role = await db.rolesUser.findOne({ where: { user_id: userId } });
  const permissions = this.toPlain(
    await db.permission.findAll({
      include: [
        {
          model: db.rolesPermission,
          where: { role_id: role.role_id },
        },
      ],
    })
  );
  const isPermission = permissions.some((el) => el.permission === permission);
  console.log({isPermission});
  return { isPermission:!!isPermission };
};
