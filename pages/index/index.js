//index.js
//获取应用实例
const app = getApp()
const jinrishici = require('../../utils/jinrishici.js')
Page({
  data: {
    title: '',
    dynasty:'',
    author:'',
    content:[],
    translate:[],
    userInfo: {},
    hasUserInfo: false,
    lineHidden:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getShici();

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  onPullDownRefresh:function(){
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
  getShici:function(){
    jinrishici.load(result => {
      // 下面是处理逻辑示例
      console.log(result)
      if (result.status == "success") {
        var setdata = {
          "title": result.data.origin.title,
          "dynasty": result.data.origin.dynasty,
          "author": result.data.origin.author,
          "content": result.data.origin.content
        }
        if (result.data.origin.translate != null) {
          setdata["lineHidden"]=true;
          console.log(result.data.origin.translate);
          setdata["translate"] = result.data.origin.translate;
        }
        console.log(setdata)
        this.setData(setdata);
      } else {
        console.log('fail');
      }
      //this.setData({ "jinrishici": result.data.origin.content })
    })
  },
  tiaozhuan:function(){
    wx.navigateTo({
      url: '../about/about'
    })
  },
  onShareAppMessage:function(){
    return {
      title:"读读诗词吧，哈哈哈",
      path:'pages/index/index'
    }
  }
})
