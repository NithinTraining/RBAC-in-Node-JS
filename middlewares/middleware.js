



const jwt = require('jsonwebtoken')
const db = require("../models")
const _ = require("lodash");

module.exports={

    checkToken :async (req, res, next) => {
    const token = req.header('auth-token');
    // const bearer = header.split(' ');
    // const token = bearer[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "no token provided"
        })
    }
    try {
        const decoded = jwt.verify(token, 'secret')
        console.log({ decoded });
        const user = await db.user.findOne({ where: { email: decoded.email }, raw: true })
        console.log({ user });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "no user found"
            })
        }
        req.user = decoded
        return next()
    }
    catch (error) {
        console.log(error);
        return res.status(201).json({
            success: false,
            message: "invalid token"
        })
    }
},
isSAdmin:async (req,res,next)=>{
    try{
        const token = req.header('auth-token');
        const getT=  jwt.verify(token, 'secret')

        const user = await db.user.findOne({ where: { email: getT.email }, raw: true })
        const role=await db.rolesUser.findOne({where:{user_id:user.user_id}})

        
          console.log(user);
          if(role.role_id !==1){
              return res.status(400).json({
                  success: false,
                  message: "you have no permission to do this operations"
              })
       
                              } else {
                                  next()
                              }

  
          
          
             
                       
    }catch(e){}
                                               },

                                               toPlain :(response) => {
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
                                              },
 
 checkpermi:async (req,res,next) => {
    const T = req.header('auth-token');
    const getT=  jwt.verify(T, 'secret')
    const {permission}=req.body.permission

    const user = await db.user.findOne({ where: { email: getT.email }, raw: true })

    const role = await db.rolesUser.findOne({ where: { user_id:user. user_id } });
    const {permission}=req.body.permission
 

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
   /* permissions.forEach(element => {
        if(permission===element){
            return next()
        }
      });*/
    const isPermission = permissions.some((el) => el.permission === permission);
    console.log({isPermission});
    /*return { isPermission:!!isPermission };*/
    if(isPermission)
    return next()
    else
    return res.status(401).json({message:"sorry you are not autherized persion to do this operation"})
  }
}
  


                                            
         
                         
         

