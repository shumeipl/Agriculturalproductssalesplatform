const db = wx.cloud.database()
const app= getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordId:'',
    hasRecordId:false,
    message:'',
    placeHolder:'请输入...',
    chatList:[],
    height:'',
    another_recordId:'',
    msg1:'',
    flag:false,
    userA_openid:'1'
  },
  input_message:function(e){
    var that = this
    that.setData({
      message:e.detail.value

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  var that = this
  that.setData({
    height: wx.getSystemInfoSync().windowHeight-50,
    userA_openid:app.globalData.userA_openid
  })
  if(app.globalData.userA_openid=='undefined'){
    that.setData({
      flag:false
    })
  }
  if(app.globalData.userA_openid!='undefined'){
  that.setData({
    flag:true
  })
  console.log(that.data.flag)
  that.getRecordId()
  }
  },
  AddanotherRecord:function(){
    var that = this
    console.log('执行添加记录'),
    db.collection('ChatRecord').add({
      data:{
        record:[],
        userB_faceImg:app.globalData.userA_faceImg,
        userB_nickname:app.globalData.userA_nickname,
        userA_faceImg:app.globalData.userB_faceImg,
        userA_nickname:app.globalData.userB_nickname,
        userA_openid:app.globalData.userB_openid,
        userB_openid:app.globalData.userA_openid,
        text_status:1
      }
    }).then({
      success(res){
        that.getanotherRecordId()
      }
    })
  },
  gomine:function(){
    wx.switchTab({
      url: '../mine/mine',
    })
  },
  getanotherRecordId:function(){
    var that = this
   db.collection('ChatRecord').where({
     userA_openid:app.globalData.userB_openid,
     userB_openid:app.globalData.userA_openid,
   }).get({
     success(res){
       that.setData({
        another_recordId:res.data[0]._id,
         hasanotherRecordId:true
       })
       that.getChatRecord()
     }
   })
  },
 getRecordId:function(){
   var that = this
  db.collection('ChatRecord').where({
    userA_openid:app.globalData.userA_openid,
    userB_openid:app.globalData.userB_openid
  }).get({
    success(res){
      if(res.data.length==0){
        that.AddRecord(),
        that.AddanotherRecord()
      }
      else{
      that.setData({
        recordId:res.data[0]._id
      })
    }
    that.getChatRecord()
    that.getanotherRecordId()
    }
  })
 },
AddRecord:function(){
  var that = this
  db.collection('ChatRecord').add({
    data:{
      record:[],
      userA_faceImg:app.globalData.userA_faceImg,
      userA_nickname:app.globalData.userA_nickname,
      userB_faceImg:app.globalData.userA_faceImg,
      userB_nickname:app.globalData.userB_nickname,
      userA_openid:app.globalData.userA_openid,
      userB_openid:app.globalData.userB_openid,
      text_status:1
    }
  }).then({
    success(res){
      that.getRecordId()
      console.log('添加成功')
    }
  })
},

 getChatRecord:function(){
  var that = this
  db.collection('ChatRecord').doc(that.data.recordId).get({
    success(res){
      that.setData({
        chatList:res.data.record,
          message:'',
          placeHolder:"请输入..."
      })
    }
  })
  db.collection('ChatRecord').doc(that.data.recordId).update({
    data:{
      text_status:1
    }
  }).then(res=>{
  })
},



publishChat(){
  this.getRecordId()
  var that = this
  db.collection('ChatRecord').doc(that.data.recordId).get({
    success(res){
      var record = res.data.record
      console.log(res.data.record)
      var msg={
      nickname:app.globalData.userA_nickname,
      faceImg:app.globalData.userA_faceImg,
      openid:app.globalData.userA_openid,
      text:that.data.message,
      tonickname:app.globalData.userB_nickname,
      time:util.formatTime(new Date)
      }
      that.setData({
        msg1:msg.time
      })
      // 在chat里面找到record 追加msg
      record.push(msg)
      db.collection('ChatRecord').doc(that.data.recordId).update({
        data:{
          record:record,
          text_status:1,
          time:that.data.msg1
        },}).then({
        success(res){
          db.collection('ChatRecord').doc(that.data.another_recordId).get({
            success(res){
              var record = res.data.record
              var msg={
                nickname:app.globalData.userA_admin,
                faceImg:app.globalData.userA_faceImg,
                openid:app.globalData.userA_openid,
                text:that.data.messag,
                time:that.data.msg1
                }
              // 在chat里面找到record 追加msg
              record.push(msg)
               console.log(msg)
               console.log(record)
              db.collection('ChatRecord').doc(that.data.another_recordId).update({
                data:{
                record:record,
                text_status:0,
                time:that.data.msg1
                },
                success(res){
                  that.getChatRecord()
                  
                }
              })
            }
          })
          console.log(res.data)
          that.getChatRecord() 
          console.log(that.data.msg1)
        }
      })
    }
  })
 
},
getScollBottom() {
  this.setData({
    scrollLast: 'item' + this.data.chatList.length
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log(app.globalData.userB_nickname)
    wx.setNavigationBarTitle({
      title:app.globalData.userB_nickname,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getChatRecord()
  },

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