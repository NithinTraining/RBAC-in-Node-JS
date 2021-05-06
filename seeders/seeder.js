'use strict';


const db = require("../models")
const u=require("../models/user")
const fs = require('fs');



try{
    let rawdata = fs.readFileSync('./databaseFeed/permission.json');
let { permissions } = JSON.parse(rawdata);

console.log(permissions);

permissions.forEach(async (item) => {
    await db.permission.create({
        name: item.permission,
        label: item.label

    })
    
})


 


}catch(e){
    console.log("error ==>",e)
}






