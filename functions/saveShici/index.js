// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    await db.collection('shicicontent').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: event.title,
        content: event.content
      }
    });

    await db.collection('shareinfo').add({
      data: {
        title: event.title,
        timestamp: event.timestamp,
        fromuseropenid: event.userInfo.openId,
        fromuserimg: event.fromuserimg
      }
    });
  } catch (e) {
    console.error(e)
  }

}