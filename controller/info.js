const db = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validToken = require("../middlewares/middleware");
const { checkPermission } = require("../helpers")

module.exports = {
  signUp: async (req, res) => {
    try {
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(req.body.password, salt);
      const users = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role_id: req.body.isAdmin ? 2 : 3,
      };

      const result = await db.user.create(users);

      return res.status(200).json({
        success: true,
        message: "user created Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },
  login: async (req, res) => {
    try {
      const user = await db.user.findOne({ where: { email: req.body.email } });
      if (!user) {
        res.status(401).json({
          message: "No User Found",
        });
      } else {
        bcryptjs.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                user_id: user.id,
              },
              "secret"
            );
            res.status(200).json({
              success: true,
              message: "authentication successfull",
              token: token,
            });
          } else {
            res.status(401).json({
              success: false,
              message: "invalid credentials",
            });
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },
  allUsers: async (req, res) => {
    try {
      const { isPermission } = await checkPermission({
        userId: req.user.user_id,
        permission: "LIST_USER",
      });
      if (!isPermission) {
        return res.status(404).json({
          success: false,
          message: "you have no permission to list permissions",
        });
      }
      const usersList = await db.user.findAll();

      return res.status(200).json({
        success: true,
        message: "Got All the users",
        data: usersList,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  },
  getProfile: async (req, res) => {
    try {
      // console.log(req);
      const {isPermission}= await checkPermission({
          userId: req.user.user_id,
          permission:'VIEW_USER'
      })
      if (!isPermission) {
        return res.status(404).json({
          success: false,
          message: "you have no permission to get profile",
        });
      }

      return res.status(200).json({
        success: true,
        message: "get user profile successfully",
        data: req.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  
}
  };

