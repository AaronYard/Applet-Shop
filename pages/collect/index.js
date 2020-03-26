// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    tabs: [
      {
        id: 0,
        value: '商品收藏',
        isActive: true
      },
      {
        id: 1,
        value: '品牌收藏',
        isActive: false
      },
      {
        id: 2,
        value: '店铺收藏',
        isActive: false
      },
      {
        id: 3,
        value: '浏览足迹',
        isActive: false
      },
    ],
  },

  onShow() {
    let collect = wx.getStorageSync('collect') || [];
    this.setData({
      collect
    })
  },
  // 标题点击事件， 接收从 子组件传过来的参数
  handleTabsItemChange(e) {
    console.log(e);
    // 1. 获取点击的标题索引
    const { index } = e.detail;
    // 2. 修改源数组 Tabs 
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3. 重新赋值 Tabs
    this.setData({
      tabs
    })
  },
 
})