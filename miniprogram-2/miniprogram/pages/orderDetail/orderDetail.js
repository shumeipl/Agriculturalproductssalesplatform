const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(app.globalData.openid)
    this.setData ({
      status:options.status
    })
    if(this.data.status<4){
      this.getOrderList()
    }else{
      wx.cloud.database().collection('PRODUCT_ORDERS').get().then(res=>{
        console.log(res)
        this.setData({
          orderList:res.data
        })
      })
    }
  },
  chooseType(e){
    console.log(e.currentTarget.dataset.type)
    let status = e.currentTarget.dataset.type
    this.setData({
      status
    })
    this.getOrderList()
  },
  getOrderList(){
    wx.cloud.database().collection('PRODUCT_ORDERS').where({
      status :Number(this.data.status)
    }).orderBy('time','desc').get().then(res=>{
      console.log(res)
      this.setData({
        orderList:res.data
      })
    })
  },
  getAll(e){
    let status=e.currentTarget.dataset.type
    this.setData({
      status
    })
    wx.cloud.database().collection('PRODUCT_ORDERS').orderBy('time','desc').get().then(res=>{
      console.log(res)
      this.setData({
        orderList:res.data
      })
    })
  },

  //继续支付
  toPay(e){
    let id = e.currentTarget.dataset.id
    this.setData({
      id:id
    })
    wx.showModal({
      title:'提示',
      content:'是否支付',
      confirmText:'支付'
    }).then(res=>{
      console.log(res)
     if(res.confirm==true){
       wx.cloud.database().collection('PRODUCT_ORDERS').doc(this.data.id).update({
         data:{
           status:0
         }
       }).then(result=>{
         wx.navigateTo({
           url: '/pages/orders/paySuccess/paySuccess',
         })
         this.setData({
           orderList:result.data
         })
       })
     }
     else{
       wx.navigateBack({
         delta: 0,
         success(){
           wx.showToast({
             title: '支付失败',
             icon:'error'
           })
         }
       })
     }
    })
  },
  //取消订单
  Cancel(){},
  //修改地址
  changeAddree(){},
  //确认收货
  conformHarvest(){},
  //评价
  toEvaluate(){},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    wx.cloud.database().collection('PRODUCT_ORDERS').get().then(res=>{
      console.log(res)
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
