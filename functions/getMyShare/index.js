// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var fromuseropenid = event.userInfo.openId;
  return await db.collection('shareinfo').where({ fromuseropenid: fromuseropenid }).orderBy('timestamp','desc').field({
    timestamp:true,
    title:true
  }).get()
}