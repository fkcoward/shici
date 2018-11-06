// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    var contenttitle = await db.collection('shicicontent').where({
      _id: event.title
    }).limit(1).get();
    var r1 = {
      "errMsg": 'no'
    };

    if (contenttitle.data.length===0) {
      //需要添加
      r1 = await db.collection('shicicontent').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          _id: event.title,
          content: event.content
        }
      });
    } else {
      //有这个字段，不需要添加
      r1 = {
        "errMsg": 'collection.add:ok'
      };
    }
    var r2 = await db.collection('shareandlike').add({
      data: {
        title: event.title,
        timestamp: event.timestamp,
        fromuseropenid: event.userInfo.openId,
        sflag: event.sflag
      }
    });
    if (r1.errMsg === 'collection.add:ok' && r2.errMsg === 'collection.add:ok') {
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