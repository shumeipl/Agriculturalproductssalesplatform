// pages/search/search.js
const db = wx.cloud.database()
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

  },
  getValue(e){
    console.log(e.detail.value)
    let value = e.detail.value
    this.setData({
      value
    })
    
  },
  Search(){
    db.collection('PRODUCT').where({
      product_name:db.RegExp({
        regexp:this.data.value,
        options:'i'
      })
    }).get().then(res=>{
      console.log(res)
      this.setData({
        goodsList:res.data
      })
    })
  }
})
