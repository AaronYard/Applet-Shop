import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime';    // 支持 Es7

Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [],     // 左侧的菜单数据
    rightContent: [],     // 右侧的商品数据
    currentIndex: 0,      // 被点击的左侧菜单
    scrollTop: 0,         // 右侧内容的滚动条 距离 顶部的距离
  },
  Cates: [],           // 接口的返回数据
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取本地存储旧数据
    const Cates = wx.getStorageSync('cates');

    if (!Cates) {
      this.getCates()        // 判断是否存在本地数据，没有则发送请求获取
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates()        // 有旧的数据， 再时间过期 则发送请求
      } else {
        // console.log('可以使用旧数据');
        this.Cates = Cates.data;        // 使用 本地数据 
        let leftMenuList = this.Cates.map(v => v.cat_name)       //左侧菜单数据
        let rightContent = this.Cates[0].children              // 获取右侧第一条数据
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }


    this.getCates()
  },

  // 获取分类数据
  // getCates() {
  //   request({ url: '/categories'})
  //   .then(res => {
  //     this.Cates = res.data.message             // 接口的返回数据
  //     wx.setStorageSync("cates", {time: Date.now(), data:this.Cates}) // 将获取的数据存入 本地存储

  //     let leftMenuList = this.Cates.map(v => v.cat_name)       //左侧菜单数据
  //     let rightContent = this.Cates[0].children              // 获取右侧第一条数据
  //     this.setData({
  //       leftMenuList,
  //       rightContent
  //     })
  //   })
  // },

  async getCates() {
    const res = await request({ url: '/categories' })
    this.Cates = res            // 接口的返回数据
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates }) // 将获取的数据存入 本地存储

    let leftMenuList = this.Cates.map(v => v.cat_name)       //左侧菜单数据
    let rightContent = this.Cates[0].children              // 获取右侧第一条数据
    this.setData({
      leftMenuList,
      rightContent
    })
  },


// 左侧菜单的点击事件
handleItemTap(e) {
  const { index } = e.currentTarget.dataset;      // 获取自定义属性 index
  let rightContent = this.Cates[index].children  // 根据索引，获取右侧数据
  this.setData({
    currentIndex: index,
    rightContent,
    // 重新设置 右侧内容的 scroll-view 标签的 距离顶部的 距离
    scrollTop: 0

  })
}

  
})