// pages/productDetail/productDetail.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取商品详情信息
    console.log(options)
    db.collection('PRODUCT').doc(options.id).get().then(res=>{
      console.log(res)
      this.setData({
        productDetail:res.data,
        user_openid:res.data.user_openid
      })
    })
     //获取购物车信息
     db.collection('CartList').get().then(result=>{
      console.log(result)
      this.setData({
        cartList:result.data
      })
    })

  },
  // 去和客服聊天
  tochat:function(){
    app.globalData.userB_openid=this.data.user_openid,
    db.collection('USER').where({
      _openid:this.data.user_openid
    }).get({
      success(res){
        console.log(res.data)
        app.globalData.userB_faceImg=res.data[0].faceImg,
        app.globalData.userB_nickname=res.data[0].nickName
        console.log(app.globalData.userB_nickname)
        wx.navigateTo({
          url: '../chat/chat',
        })
      }
    })
  },
    //点击回到主页
  toHome(){
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  //点击进入购物车
  toShopcart(){
    wx.switchTab({
      url: '/pages/shopcart/shopcart',
    })
  },
 
  //分享给朋友
  onShareAppMessage(){
    console.log(this.data.goodsDetail.name)
    return{
      title:this.data.productDetail.product_name,
      path:'/pages/productDetail/productDetail?id=' + this.data.productDetail._id,
      imageUrl:this.data.productDetail.product_faceImg
    }
  },
   //分享到朋友圈
   onShareTimeline(){
    return{
      title:this.data.goodsDetail.name,
      query:{
        id:this.data.goodsDetail._id
      },
      imageUrl:this.data.goodsDetail.cover
    }
  },

  //添加当前商品到购物车
  addShopcart(){
    let count = 0
    for(let i  in this.data.cartList){
      count=count+1
    }
    let index = -1
    if(count==0){
      db.collection('CartList').add({
        data:{
        product_id:this.data.productDetail._id,
        product_name:this.data.productDetail.product_name,
        product_price:this.data.productDetail.product_price,
        product_faceImg:this.data.productDetail.product_faceImg,
        product_choose:false,
        product_number:1,
        }
      }).then(addres=>{
        console.log(addres)
      })
    }else{
      for(let idx in this.data.cartList){
        console.log(idx)
        if(this.data.cartList[idx].product_id==this.data.productDetail._id){
          index=idx
        }
      }if(index!=-1){
        db.collection('CartList').where({
          product_id:this.data.productDetail._id
        }).update({
          data:{
            product_number:this.data.cartList[index].product_number+1
          }
        }).then(updateres=>{
          console.log(updateres)
        })
      }else{
        db.collection('CartList').add({
          data:{
          product_id:this.data.productDetail._id,
          product_name:this.data.productDetail.product_name,
          product_price:this.data.productDetail.product_price,
          product_faceImg:this.data.productDetail.product_faceImg,
          product_choose:false,
          product_number:1,
          }
        }).then(addres=>{
          console.log(addres)
        })
      }
    }

  },

  //点击立即购买进入订单页面
  toOrder(){
    let orderList = [] 
    orderList.push(this.data.productDetail)
    app.globalData.orderList = orderList
    wx.navigateTo({
      url: '/pages/orders/orders?sum='+this.data.productDetail.product_price+'&count=1',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

})