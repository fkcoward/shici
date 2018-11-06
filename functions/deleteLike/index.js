// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var where1={};
    if(event.sflag===0){
      where1={
        fromuseropenid: event.userInfo.openId,
        title:event.title
      };
    }else{
      where1={
        fromuseropenid: event.userInfo.openId,
        title:event.title,
        sflag: event.sflag
      };
    }
    var r1= await db.collection('shareandlike').where(where1).remove();
    if (r1.errMsg === 'collection.remove:ok' ) {
      return {
        "ret": true
      }
    } else {
      return {
        "ret": false
      }
    }
    
  } catch (e) {
    console.error(e)
  }
}