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
    
    if (query != null && query != undefined && JSON.stringify(query) !== '{}') {
      const db = wx.cloud.database()
      db.collection('shicicontent').where({
        title: query.title
      }).get({
        success: function(res) {
          console.log(res.data)
          that.setThisData(res.data[0].content)
          
        },
        fail:function(){
          that.getShici()
        }
      })
      this.saveReadInfo(query);
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
  onReady:function(){
    try {
      var know = wx.getStorageSync('iknow')
      if (!know) {

        wx.showModal({
          title: '欢迎',
          content: '诗词界面下拉可以刷新下一首，分享给好友可以查看到分享记录。',
          confirmText: "知道了",
          showCancel: false,
          success: () => {
            console.log('know')
            wx.setStorage({
              key: "iknow",
              data: true
            })
          }
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  onPullDownRefresh: function() {
    this.getShici();
    wx.stopPullDownRefresh();
  },
  getUserInfo: function(e) {
    //console.log(e)
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
      //console.log(result)
      this.setData({
        "result": result
      });
      if (result.status == "success") {
        that.setThisData(result.data.origin)
      } else {
        console.log('fail');
      }
    })
  },
  tiaozhuan: function() {
    wx.navigateTo({
      url: '../share/share'
    })
  },
  tiaozhuanzz: function () {
    wx.navigateTo({
      url: '../about/about'
    })
  },
  onShareAppMessage: function() {
    //console.log(this.data.userInfo);
    var title = this.data.title
    var timestamp=new Date().getTime();
    this.getShareData(this.data.result, title,timestamp)
    return {
      title: "向您分享一首《" + title + "》",
      path: 'pages/index/index?title=' + title+'&timestamp='+timestamp
    }

  },
  getShareData: function (data, title, timestamp) {
    
    var avatarUrl ="https://7368-shici-52bb90-1257955384.tcb.qcloud.la/微信图片_20181104121235.jpg?sign=9595ff30448ae5dda66829f3396aa116&t=1541304772";
    if(this.data.hasUserInfo){
      avatarUrl = this.data.userInfo.avatarUrl;
    }
    wx.cloud.callFunction({
      // 云函数名称
      name: 'saveShici',
      // 传给云函数的参数
      data: {
        title: title,
        content: data.data.origin,
        timestamp: timestamp,
        fromuserimg:avatarUrl
      },
      success: (res) => {
        console.log(res)
      },
      fail: console.error
    })
  },
  setThisData:function(data){
    console.log(data)
    var setdata = {
      "title": data.title,
      "dynasty": data.dynasty,
      "author": data.author,
      "content": data.content,
      "translate":"",
      "lineHidden":false
    }
    if (data.translate != null) {
      setdata["lineHidden"] = true;
      console.log(data.translate);
      setdata["translate"] = data.translate;
    }
    this.setData(setdata);
  },
  saveReadInfo:function(query){
   
    wx.cloud.callFunction({
      // 云函数名称
      name: 'saveRead',
      // 传给云函数的参数
      data: {
        title: query.title,
        timestamp: query.timestamp
      },
      success: (res) => {
        console.log(res)
      },
      fail: console.error
    })
  }
})