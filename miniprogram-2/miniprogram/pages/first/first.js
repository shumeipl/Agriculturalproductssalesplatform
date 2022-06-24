// pages/first/first.js
const db = wx.cloud.database()
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    title:'',
    purchase_products:[],
    number:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id:options.id,
      title:options.title
    })
    if(options.id==4){
      this.getPurchaseProducts()
    }
  },
  getPurchaseProducts:function(){
    var that = this
    db.collection('already_purchase').where({
      comment_status:0,
      _openid:app.globalData.userA_openid
    }).get({
      success(res){
        that.setData({
          purchase_products:res.data,
          number:res.data.length
        })
        console.log(res.data)
      }
    })
  },
  gotoComment:function(e){
    var purchase_id =  this.data.purchase_products[e.currentTarget.id]._id
    wx.navigateTo({
      url: '../comment/comment?purchase_id='+purchase_id,
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.id==3){
      this.getPurchaseProducts()
    }
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