const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  businessList:[],
  length:'',
  height:'',
  flag:false
  },
  chat:function(e){
    var index=e.currentTarget.dataset.index
    app.globalData.userB_openid = this.data.businessList[index].userB_openid
    app.globalData.userB_nickname = this.data.businessList[index].userB_nickname
    app.globalData.userB_faceImg=this.data.businessList[index].userB_faceImg
    console.log(app.globalData.userB_faceImg)
    wx.navigateTo({
      url: '../chat/chat',
    })
  },
  // getBussiness:function(){
  //   var that = this
  //   db.collection('chat_users').get({
  //     success(res){
  //       console.log(res.data)
  //       that.setData({
  //         businessList:res.data
  //       })
  //     }
  //   })
  // },
  getChatList:function(){
    var that = this
    db.collection('ChatRecord').orderBy('time','desc').where({
      userA_openid:app.globalData.userA_openid
    }).get({
      success(res){
        that.setData({
          businessList:res.data,
        })
        console.log(res.data)
   }
    }
    )
  },
  gomine:function(){
    wx.switchTab({
      url: '../mine/mine',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getBussiness(),
    this.setData({
      height: wx.getSystemInfoSync().windowHeight
    })
    console.log(app.globalData.userA_openid)
    if(app.globalData.userA_openid!='undefined'){
      this.setData({
        flag:true
      })
    }
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
    this.getChatList()
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

  }
})