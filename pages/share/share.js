// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sclist:[],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '收藏分享', //导航栏 中间的标题
      back_pre: true,
      showAboutme: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getMyShare',
      // 传给云函数的参数
      data: { },
      success: (res) => {
        if(res.result){
          that.setThisData(res.result.data);
        }
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "邀请您阅读诗词",
      path: 'pages/index/index'
    }
  },
  setThisData:function(res){
    var newarr;
    var that=this;
    newarr=res.map(function(obj){
      return {
        "title":obj.title,
        "timestamp": that.timestampToTime(obj.timestamp)
      }
    });
    console.log(newarr);
    this.setData({
      sclist:newarr
    });
  },
  timestampToTime:function(timestamp) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
  },
  myclick:function(events){
    console.log(events.currentTarget.dataset);
    wx.navigateTo({
      url: '../detail/detail?title='+events.currentTarget.dataset.title
    })
  }
})