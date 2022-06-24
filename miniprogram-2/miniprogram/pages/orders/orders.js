// pages/orders/orders.js
const db = wx.cloud.database()
const app = getApp()
const util = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      sum:options.sum,
      count:options.count
    })
  },

   //获取收货地址
   addAddress(){
    wx.chooseAddress({
      success: (result) => {
        console.log(result)
        this.setData({
          phone:result.telNumber,
          name:result.userName,
          address:result.provinceName+result.cityName+result.countyName+result.detailInfo
        })
        wx.setStorageSync('address', result)
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log(app.globalData.orderList)
    this.setData({
        orderList:app.globalData.orderList
    })
    console.log(this.data.orderList)
    //读取缓存中的地址信息
    let address = wx.getStorageSync('address')
    this.setData({
      phone:address.telNumber,
      name:address.userName,
      address:address.provinceName+address.cityName+address.countyName+address.detailInfo
    })
  },

  
 //提交订单
 addOrder(){
  db.collection('PRODUCT_ORDERS').add({
    data:{
      name:this.data.name,
      phone:this.data.phone,
      address:this.data.address,
      product:this.data.orderList,
      total:this.data.sum,
      time:util.formatTime(new Date),
      status:-1,//-1:待支付  0:待发货，1：待收货+已发货，2：待评价，3：已完成
    }
  }).then(res=>{
    console.log(res)
    let orderId = res._id
    this.setData({
      orderId
    })
    //调起微信支付
  //this.pay()
  //调起虚拟支付
  this.xuniPay()
  })
},
xuniPay(){
  wx.showModal({
    title:'提示',
    content:'是否支付'+this.data.sum+'元',
    confirmText:'支付'
  }).then(res=>{
    console.log(res)
   if(res.confirm==true){
     db.collection('PRODUCT_ORDERS').doc(this.data.orderId).update({
       data:{
         status:0
       }
     }).then(result=>{
       wx.navigateTo({
         url: '/pages/orders/paySuccess/paySuccess',
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
   //将数据添加到缓存
  // wx.setStorageSync('cartList', app.globalData.cartList)





  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})