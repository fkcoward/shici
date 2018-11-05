// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var readTimestamp = new Date().getTime();
    return await db.collection('readinfo').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: event.title,
        timestamp: event.timestamp,
        touseropenid: event.userInfo.openId,
        readTimestamp: readTimestamp
      }
    });
  } catch (e) {
    console.error(e)
  }
}