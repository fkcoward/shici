// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '诗词', //导航栏 中间的标题
      back_pre: true,
      showAboutme: true
    },
    title: '',
    dynasty: '',
    author: '',
    content: [],
    translate: [],
    lineHidden: false,
    result: '',
    donghua: "none",
    likeImgSrc: './../../image/like1.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options !== '{}') {
      var that = this;
      console.log(options)
      const db = wx.cloud.database()
      db.collection('shicicontent').where({
        _id: options.title
      }).get({
        success: function(res) {
          console.log(res)
          that.setThisData(res.data[0].content)

        },
        fail: function() {
          //that.getShici()
        }
      })
      //this.saveReadInfo(query);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },


  setThisData: function(data) {
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
  like: function () {
    if (this.data.likeImgSrc === './../../image/like2.png') {
      console.log("这是to like")
      this.setData({
        "donghua": "myfirst"
      });
      var timestamp = new Date().getTime();
      this.getShareData(this.data.title, timestamp, 1);
      // console.log(this.data.result)

    } else {
      console.log('to not like')
      this.setData({
        "donghua": "myfirst"
      });
      this.deleteLikeData(this.data.title, 0);

    }
  },
  doLike: function () {
    this.setData({
      "likeImgSrc": './../../image/like1.png',
      "donghua": "none"
    })
  },
  doNotLike: function () {
    this.setData({
      "likeImgSrc": './../../image/like2.png',
      "donghua": "none"
    })
  },
  getShareData: function (title, timestamp, sflag) {
    //sflag 2是分享 1 是喜欢
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'saveShici',
      // 传给云函数的参数
      data: {
        title: title,
        timestamp: timestamp,
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
  deleteLikeData: function (title, sflag) {
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
  back2:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})