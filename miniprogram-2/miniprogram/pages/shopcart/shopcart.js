// pages/shopcart/shopcart.js
const db = wx.cloud.database()
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allChoose:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
 
    db.collection('CartList').where({
      product_choose:true
    }).update({
      data:{
        product_choose:false
      }
    }).then(result=>{
      console.log(result)
      this.setData({
        cartList:result.data
      })
    })
  },

  onShow() {
    db.collection('CartList').get().then(res=>{
      console.log(res)
      this.setData({
          cartList:res.data
      })
  })
  },

  //是否选择商品
  choose(e){
    let j=0;
    let k=0;
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    this.data.cartList[index].product_choose = !this.data.cartList[index].product_choose
    this.setData({
      cartList:this.data.cartList
  })
  for(let i in this.data.cartList){
    j=j+1
    if(this.data.cartList[i].product_choose==true){
      k=k+1;
    }
  }
  if(j!=0&&j==k){
    this.setData({
      allChoose:true
    })
  }else{
    this.setData({
      allChoose:false
    })
  }
  db.collection('CartList').where({
    product_id:this.data.cartList[index].product_id
  }).update({
    data:{
      product_choose:this.data.cartList[index].product_choose
    }
  }).then(updateres=>{
    console.log(updateres)
  })
  this.countTotal()
  },
  //点击进入商品详情页
  toProductDetail(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/pages/productDetail/productDetail?id='+id,
        })
  },

  //点击增加商品数量
  add(e){
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    this.data.cartList[index].product_number = this.data.cartList[index].product_number+1
    this.setData({
      cartList:this.data.cartList
    })
    db.collection('CartList').where({
      product_id:this.data.cartList[index].product_id
    }).update({
      data:{
        product_number:this.data.cartList[index].product_number
      }
    }).then(updateresult=>{
      console.log(updateresult)
    })
    this.countTotal()
  },

  //点击减少商品数量
  reduce(e){
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    if(this.data.cartList[index].product_number!=1){
    this.data.cartList[index].product_number = this.data.cartList[index].product_number-1
    db.collection('CartList').where({
      product_id:this.data.cartList[index].product_id
    }).update({
      data:{
        product_number:this.data.cartList[index].product_number
      }
    }).then(updateresult=>{
      console.log(updateresult)
    })
  }else{
    wx.showToast({
      title: '该商品不能减少了哟~',
    })
  }
  this.setData({
    cartList:this.data.cartList
  })
  this.countTotal()
  },

  //底部全选
  chooseAll(){
    this.setData({
      allChoose:!this.data.allChoose
  })
  console.log(this.data.allChoose)
  if(this.data.allChoose==true){
    for(let index in this.data.cartList){
        this.data.cartList[index].product_choose=true
        db.collection('CartList').where({
          product_id:this.data.cartList[index].product_id
        }).update({
          data:{
            product_choose:this.data.cartList[index].product_choose
          }
        }).then(updateRes=>{
          console.log(updateRes)
        })
    }
}else{
  for(let index in this.data.cartList){
      this.data.cartList[index].product_choose = false
      db.collection('CartList').where({
        product_id:this.data.cartList[index].product_id
      }).update({
        data:{
          product_choose:this.data.cartList[index].product_choose
        }
      }).then(updateRes=>{
        console.log(updateRes)
      })
  }
}
this.setData({
  cartList:this.data.cartList
})
this.countTotal()


  },

  //计算购买商品价格合计
  countTotal(){
    let sum = 0
    let length = 0
    let count = 0
    for(let index in this.data.cartList){
      if(this.data.cartList[index].product_choose == true){
          sum = sum + this.data.cartList[index].product_price * this.data.cartList[index].product_number;
          length=length+1,
          count=count+this.data.cartList[index].product_number
      }
    }
    this.setData({
      sum:sum.toFixed(2),
      length,
      count
  })
  },
  //跳转到订单页面
  toOrder(){
    let orderList = []
    if(this.data.length == 0){
        wx.showToast({
          title: '请选择商品',
        })
    }else{
    for(let index in this.data.cartList){
      if(this.data.cartList[index].product_choose==true){
          orderList.push(this.data.cartList[index])
        }
    }
    app.globalData.orderList = orderList
    wx.navigateTo({
      url: '/pages/orders/orders?sum='+this.data.sum+'&count='+this.data.count
    })
  }
  }
})