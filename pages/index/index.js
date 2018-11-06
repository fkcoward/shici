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
    donghua:"none",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    likeImgSrc: './../../image/like2.png',
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '诗词', //导航栏 中间的标题
      back_pre: false,
      showAboutme: true
    },
    height: app.globalData.height * 2 + 20
  },
  onLoad: function(query) {
    var that = this

    if (query != null && query != undefined && JSON.stringify(query) !== '{}') {
      const db = wx.cloud.database()
      db.collection('shicicontent').where({
        _id: query.title
      }).get({
        success: function(res) {
          console.log(res.data)
          that.setThisData(res.data[0].content)

        },
        fail: function() {
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
  onReady: function() {
    try {
      var know = wx.getStorageSync('iknow')
      if (!know) {

        wx.showModal({
          title: '欢迎',
          content: '诗词界面下拉阅读下一首，标注收藏或分享给好友可以保存到收藏记录，点击右上角图标可以查看开发者信息。',
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
    console.log('下拉刷新');
    this.doNotLike();
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
    var that = this
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
  listShare: function() {
    wx.navigateTo({
      url: '../share/share'
    })
  },
  like: function() {
    if (this.data.likeImgSrc === './../../image/like2.png') {
      console.log("这是to like")
      this.setData({
        "donghua":"myfirst"
      });
      var timestamp = new Date().getTime();
      this.getShareData(this.data.result,this.data.title, timestamp, 1);
      // console.log(this.data.result)

    } else {
      console.log('to not like')
      this.setData({
        "donghua": "myfirst"
      });
      this.deleteLikeData(this.data.title, 0);

    }
  },
  doLike: function() {
    this.setData({
      "likeImgSrc": './../../image/like1.png',
      "donghua":"none"
    })
  },
  doNotLike: function() {
    this.setData({
      "likeImgSrc": './../../image/like2.png',
      "donghua":"none"
    })
  },
  onShareAppMessage: function() {
    //console.log(this.data.userInfo);
    var title = this.data.title
    var timestamp = new Date().getTime();
    this.getShareData(this.data.result,title, timestamp, 2)
    return {
      title: "向您分享一首《" + title + "》",
      path: 'pages/index/index?title=' + title + '&timestamp=' + timestamp
    }

  },
  deleteLikeData: function(title, sflag) {
    console.log(title+sflag+'==============');
    var that = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'deleteLike',
      // 传给云函数的参数
      data: {
        title: title,
        sflag: sflag
      },
      success: (res) => {
        if (res.result.ret === true) {
          that.doNotLike()
        }
      },
      fail: console.error
    })
  },
  getShareData: function(data,title, timestamp, sflag) {
    //sflag 2是分享 1 是喜欢
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'saveShici',
      // 传给云函数的参数
      data: {
        title: title,
        timestamp: timestamp,
        content: data.data.origin,
        sflag: sflag
      },
      success: (res) => {
        console.log(res)
        if (res.result.ret === true) {
          that.doLike()
        }
      },
      fail: console.error
    })
  },
  setThisData: function(data) {
    console.log(data)
    var setdata = {
      "title": data.title,
      "dynasty": data.dynasty,
      "author": data.author,
      "content": data.content,
      "translate": "",
      "lineHidden": false
    }
    if (data.translate != null) {
      setdata["lineHidden"] = true;
      console.log(data.translate);
      setdata["translate"] = data.translate;
    }
    this.setData(setdata);
  },
  saveReadInfo: function(query) {

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