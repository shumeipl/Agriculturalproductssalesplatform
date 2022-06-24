// pages/mine/mine.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:app.globalData.boy_icon,
    nickName:'登录',
    servicelist:[{
      id:-1,
      name:'待支付',
      picture:'http://tmp/IAqbpf3rBAs80bc04d2e637fc165e7182630c00a91a3.png'
    },{
      id:0,
      name:'待发货',
      picture:'http://tmp/iagjjLnzJjAK0cbdca87985d6b79072e8c088fc9619a.png'
    },
   {
      id:1,
      name:'待收货',
      picture:'http://tmp/oKuUcYwZ8YJO50c3c11615f54bb6434e97eabf5545df.png'
   },
  {
    id:2,
    name:'待评价',
    picture:'http://tmp/vYf4JaGwNRH7749e5929275a20110791dabab677626f.png'
  },
  {
    id:5,
    name:'退款/售后',
    picture:'http://tmp/WwbA9T58NUwJf1b8a89c560b7a1abdbff6c4960581c8.png'
  
}],
  more:[{
    id:1,
    name:'客服中心',
    picture:'http://tmp/tCIoRyTtfXi83b0bd414d4cebf2ea62f8d5d16833ec1.png'
  },
{
  id:2,
  name:'意见反馈',
  picture:'http://tmp/6b66cgPanIPq0491479805543094b1f270bc84bda52d.png'
},
{
  id:3,
  name:'公众号',
  picture:'http://tmp/VaexFxld6JRAc60253b88e5af77281325da8030dfeaf.png'
},{
  id:4,
  name:'关于我们',
  picture:'http://tmp/lS0ZgA3QK9CE51b64078e80d9f65fceed1e5cb19a620.png'
},
{
  id:5,
  name:'设置',
  picture:'http://tmp/1YIHyQLSxIM3f125ff931a647015ab9dc8f8a451369e.png'
}
],
userInfo:'',
openId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  Btnuser:function(){
    wx.getUserProfile({
      desc: '获取头像和昵称',
      success:(res)=>{
        this.setData({
          avatarUrl:res.userInfo.avatarUrl,
          nickName:res.userInfo.nickName,
          userInfo:res.data
        })
      this.getOpenId()
      }
    })
  },
  getOpenId() {
   wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'getOpenId'
      }
    }).then((resp) => {
      this.setData({
        haveGetOpenId: true,
        openId: resp.result.openid
      });
      this.judge()
   }).catch((e) => {
      this.setData({
        showUploadTip: true
      });
    });
  },
    judge:function(){
      var that = this
      db.collection('USER').where({
        _openid:that.data.openId
      }).get({
        success(res){
          if(res.data.length==0){
            db.collection('USER').add({
              data:{
                nickName:that.data.nickName,
                faceImg:that.data.avatarUrl
              }
            }).then({
              success(res){
                console.log('添加成功~')
                that.judge()
              }
            })
          }
          if(res.data.length==1){
            console.log(res.data)
            app.globalData.userA_openid=res.data[0]._openid,
            app.globalData.userA_faceImg=res.data[0].faceImg,
            app.globalData.userA_nickname=res.data[0].nickName,
            console.log(app.globalData.userA_openid)
          }
        }
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