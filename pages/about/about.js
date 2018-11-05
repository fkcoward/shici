// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myinfos: "",
    imgsrc: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getMeImg',
      // 传给云函数的参数
      data: {
      },
      success:  (res)=> {
        console.log(res.result)
        console.log(res.result.data[0].image1)
        this.setData({
          imgsrc: res.result.data[0].image1,
          myinfos: res.result.data[0].myinfos
        })
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: "邀请您阅读诗词",
      path: 'pages/index/index'
    }
  },
  tiaozhuan:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})