// 引入 用来发送请求的方法， 路径要补全
import { request } from '../../request/index.js'

Page({
  data: {
    swiperList: [],          // 轮播图数组
    catesList: [],           // 导航栏数组
    floorList: []            // 楼层数据
  },
  onLoad: function (options) {
    // 用微信的方法 获取数据，不用 Promise
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     console.log(result);
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   },
    // });
    this.getSwiperList();
    this.getCateList();
    this.getFloorList()
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: '/home/swiperdata' })
    .then(res => {
      
      this.setData({
        swiperList: res
      })
    })
  },

  // 获取导航栏数据
  getCateList() {
    request({url: '/home/catitems'})
    .then(res => {
      this.setData({
        catesList: res
      })
    })
  },

  // 获取楼层数据
  getFloorList() {
    request({url: '/home/floordata'})
    .then(res => {
      console.log(res);
      this.setData({
        floorList: res
      })
    })
  }
});