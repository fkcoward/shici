// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const imageCollection=db.collection('images')
// 云函数入口函数
exports.main = async (event, context) => {
  return await imageCollection.where({id:1}).get()
}