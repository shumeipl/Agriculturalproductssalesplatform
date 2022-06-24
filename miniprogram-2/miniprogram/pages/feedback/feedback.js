// pages/feedback/feedback.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
  title:'',
  id:'',
  src:'',
  hasImage:false
  },
  Onsubmit:function(e){
    console.log('表单已被提交')
    console.log(e.detail.value)
    // 可以存放进数据库。图片由src提供
    wx.cloud.database().collection('UserFeedback').add({
      data:{
       description:e.detail.value.describe,
       contact_way:e.detail.value.contact_way,
       image:this.data.src
      },
      success(res){
        wx.showToast({
          title: '提交成功！感谢您的反馈~',
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  chooseImage:function(){
    var that=this
    wx.chooseImage({
      count: 9,
      sizeType:['compressed','original'],
      sourceType:['album','camera'],
      success:function(res){
        var tempFilePaths=res.tempFilePaths
        that.setData({src:tempFilePaths
      ,hasImage:true})
      console.log(that.data.src)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    title:options.title,
    id:options.id
  })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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