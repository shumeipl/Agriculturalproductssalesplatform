const db= wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    active:0,
    cateList:[],
    productList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: wx.getSystemInfoSync().windowHeight
    })
    this.getCateList()
    this.getproductList()
    
  },
  getCateList:function(){
    var that = this
    db.collection('PRODUCT').doc('12345678').get({
      success(res){
        console.log(res.data)
        that.setData({
          cateList:res.data.categoryList
        })
      } 
    })
  },
  getproductList:function(){
    var that = this
    console.log(that.data.cateList)
    db.collection('PRODUCT').where({
      category:that.data.cateList[that.data.active]
    }).get({
      success(res){
        console.log(res.data)
        that.setData({
          productList:res.data
        })
      }
    })
  },
  todetail:function(e){
    var id = this.data.productList[e.currentTarget.dataset.value]._id
    wx.navigateTo({
      url: '../productDetail/productDetail?id='+id,
    })
  },
  ChangeActive:function(e){
    var that=this
    that.setData({
      active:e.currentTarget.id
    })
    console.log(that.data.active)
    that.getproductList()
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