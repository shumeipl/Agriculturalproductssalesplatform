
// 获取应用实例
const app = getApp()
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    bannerList:[]
  },
  //获取商品详情
  toProductDetail(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取首页商品
    db.collection('PRODUCT').get().then(res=>{
      console.log(res)
      this.setData({
        goodsList:res.data
      })
    });
    //获取轮播图
      this.getBanners()
  },
  //获取轮播图
 getBanners(){
  db.collection('BANNERS').get().then(res=>{
    console.log(res)
    this.setData({
      bannerList:res.data
    })
  })
 },
 //获取轮播图内容
 toBannerDetail(event){
   console.log(event.currentTarget.dataset.id)
   let id = event.currentTarget.dataset.id
   wx.navigateTo({
     url: '/pages/bannersDetail/bannersDetail?id='+id,
   })
 },

 //点击搜索
 toSearch(){
   wx.navigateTo({
     url:'/pages/search/search'
   })
 },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  //获取首页显示类别
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

