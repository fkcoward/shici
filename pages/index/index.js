//index.js
//获取应用实例
const app = getApp()
const jinrishici = require('../../utils/jinrishici.js')
Page({
  data: {
    title: '',
    dynasty: '',
    author: '',
    content: [],
    translate: [],
    userInfo: {},
    hasUserInfo: false,
    lineHidden: false,
    result: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(query) {
    var that=this
    console.log(query)
    if (query != null && query != undefined && JSON.stringify(query) !== '{}') {
      const db = wx.cloud.database()
      db.collection('shicicontent').where({
        title: query.title
      }).get({
        success: function(res) {
          console.log(res.data)
          that.setThisData(res.data[0].content.data)
        },
        fail:function(){
          that.getShici()
        }
      })
    } else {
      this.getShici();
    }




    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onPullDownRefresh: function() {
    this.getShici();
    wx.stopPullDownRefresh();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getShici: function() {
    var that=this
    jinrishici.load(result => {
      // 下面是处理逻辑示例
      console.log(result)
      this.setData({
        "result": result
      });
      if (result.status == "success") {
        that.setThisData(result.data)
      } else {
        console.log('fail');
      }
      //this.setData({ "jinrishici": result.data.origin.content })
    })
  },
  tiaozhuan: function() {
    wx.navigateTo({
      url: '../about/about'
    })
  },
  onShareAppMessage: function() {
    console.log(this.data.result);
    var title = this.data.title
    this.getShareData(this.data.result, title)
    return {
      title: "向您分享一首《" + title + "》",
      path: 'pages/index/index?title=' + title
    }

  },
  getShareData: function(data, title) {
    const db = wx.cloud.database()
    db.collection('shicicontent').add({
      data: {
        title: title,
        content: data
      },
      success: function(res) {
        return res;
      },
      fail: console.error
    })
  },
  setThisData:function(data){
    var setdata = {
      "title": data.origin.title,
      "dynasty": data.origin.dynasty,
      "author": data.origin.author,
      "content": data.origin.content
    }
    if (data.origin.translate != null) {
      setdata["lineHidden"] = true;
      console.log(data.origin.translate);
      setdata["translate"] = data.origin.translate;
    }
    console.log(setdata)
    this.setData(setdata);
  }
})