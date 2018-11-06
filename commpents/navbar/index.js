const app = getApp()
Component({
  properties: {
    navbarData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    height: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1,
      showAboutme:true,
      back_pre: true
    }
  },
  attached: function () {
    // 定义导航栏的高度   方便对齐
    // console.log(this.data);
    this.setData({
      height: app.globalData.height
    })
    // console.log(app.globalData.height)
    // this.setData({
    //   back_pre: app.globalData.back_pre
    // })
  },
  methods: {
    // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
    //返回到首页
    _gotoMe() {
      wx.navigateTo({
        url: '/pages/about/about',
      })
    }
  }

})