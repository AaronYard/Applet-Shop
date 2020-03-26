/*
1 页面被打开的时候 onShow
  0 onShow 不同于onLoad 无法在形参上接收 options参数
  0.5 判断缓存中有没有token
    1 没有 直接跳转到授权页面
    2 有 直接往下进行
  1 获取url上的参数type
  2 根据type来决定页面标题的数组元素 哪个被激活选中
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据
 */

import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime';    // 支持 Es7
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      },
    ],
  },

  onShow() {
    // 发送请求前验证 token, 没 token 跳转到 授权页面
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }

    // 1. 获取当前小程序的 页面栈数组 （长度最大为 10个页面）
    let pages =  getCurrentPages();
    // 2. 数组中 索引最大的页面就是当前页面
    const currentPage = pages[pages.length -1]
    // 3. 获取 url 上的 type参数
    const {type} = currentPage.options
    // 4 根据个人中心点击的不同按钮（不同type值）判断哪个标题要改变样式 当 type=1 index=0 
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },

  // 发送请求，获取订单数据
  async getOrders(type) {
    const res = await request({ url: '/my/orders/all',data: {type}})
    console.log(res);
    this.setData({
      orders: res.orders.map(v => ({...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString())}))
    })
  },

  // 根据标题索引，来激活选中
  changeTitleByIndex(index) {
    // 2. 修改源数组 Tabs 
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3. 重新赋值 Tabs
    this.setData({
      tabs
    })
  },

  // 标题点击事件， 接收从 子组件传过来的参数
  handleTabsItemChange(e) {
    // 1. 获取点击的标题索引
    const { index } = e.detail;
    // 2. 根据定单页面 点击的不同按钮来 改变标题颜色
    this.changeTitleByIndex(index);
    // 3. 重新发送请求，获取不同页面的 内容   (注意： type = 1 时， index = 0)
    this.getOrders( index + 1)
  },
})